'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  userFormSchemaWithoutPassword,
  UserFormWithoutPassword,
} from '@/schemas/userSchema';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { Permission } from '@prisma/client';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

const permissionMapping: Record<string, Permission> = {
  ler: Permission.READ,
  escrever: Permission.WRITE,
  deletar: Permission.DELETE,
  admin: Permission.ADMIN,
};

interface EditUserActionParams {
  userId: string;
  data: UserFormWithoutPassword;
}

export interface IEditUserReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const editUserAction = withPermissions(
  'users',
  'WRITE',
  async (params: EditUserActionParams): Promise<IEditUserReturnProps> => {
    try {
      const { userId, data } = params;

      const validatedData = userFormSchemaWithoutPassword.parse(data);

      const { email, employeeId, permissions } = validatedData;

      const result = await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { id: userId },
          include: { userPermissions: true },
        });

        if (!existingUser) {
          throw new AppError(MESSAGE.USER.NOT_FOUND, 404);
        }

        const userWithSameEmail = await tx.user.findFirst({
          where: {
            email,
            id: { not: userId },
          },
        });

        if (userWithSameEmail) {
          throw new AppError(MESSAGE.USER.EXISTING_EMAIL, 400);
        }

        await tx.user.update({
          where: { id: userId },
          data: {
            email,
            employeeId,
          },
        });

        await tx.userPermission.deleteMany({
          where: { userId },
        });

        const newPermissions = Object.entries(permissions).flatMap(
          ([module, modulePermissions]) =>
            Object.entries(modulePermissions)
              .filter(([, isGranted]) => isGranted)
              .map(([permission]) => ({
                userId,
                module,
                permission:
                  permissionMapping[
                    permission.toLowerCase() as keyof typeof permissionMapping
                  ],
              }))
              .filter(
                (
                  up,
                ): up is {
                  userId: string;
                  module: string;
                  permission: Permission;
                } => up.permission !== undefined,
              ),
        );

        await tx.userPermission.createMany({
          data: newPermissions,
        });

        return MESSAGE.USER.UPDATED_SUCCESS;
      });

      revalidatePath('/users');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { Permission } from '@prisma/client';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { CombinedUserForm, combinedUserFormSchema } from '@/schemas/userSchema';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

const permissionMapping: Record<string, Permission> = {
  ler: Permission.READ,
  escrever: Permission.WRITE,
  deletar: Permission.DELETE,
  admin: Permission.ADMIN,
};

export interface ICreateUserReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const createUserAction = withPermissions(
  'users',
  'WRITE',
  async (data: CombinedUserForm): Promise<ICreateUserReturnProps> => {
    try {
      const validatedData = combinedUserFormSchema.parse(data);

      const { email, password, employeeId, permissions } = validatedData;

      const result = await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new AppError(MESSAGE.USER.EXISTING_EMAIL, 409);
        }

        const existingEmployee = await tx.employee.findUnique({
          where: { id: employeeId },
        });

        if (!existingEmployee) {
          throw new AppError(MESSAGE.EMPLOYEE.NOT_FOUND, 400);
        }

        const existingUserToEmployee = await tx.user.findUnique({
          where: {
            employeeId,
          },
        });

        if (existingUserToEmployee) {
          throw new AppError(MESSAGE.USER.EXISTING_USER_TO_EMPLOYEE, 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            employeeId,
          },
        });

        const userPermissions = Object.entries(permissions).flatMap(
          ([moduleId, modulePermissions]) =>
            Object.entries(modulePermissions)
              .filter(([_, isGranted]) => isGranted)
              .map(([permission, _]) => ({
                userId: user.id,
                module: moduleId,
                permission:
                  permissionMapping[
                    permission.toLowerCase() as keyof typeof permissionMapping
                  ],
              }))
              .filter(
                (
                  up,
                ): up is {
                  userId: number;
                  module: string;
                  permission: Permission;
                } => up.permission !== undefined,
              ),
        );

        await tx.userPermission.createMany({
          data: userPermissions,
          skipDuplicates: true,
        });

        return MESSAGE.USER.CREATED_SUCCESS;
      });

      revalidatePath('/users');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetAllActiveUsersActionResult, IUser, IContributorToSelect, IUserPermission } from '@/app/(main)/users/types';

type UserFields = {
  id?: boolean;
  email?: boolean;
  employeeId?: boolean;
  userPermissions?: boolean;
};

const permissionMapping: Record<string, 'Ler' | 'Escrever' | 'Deletar' | 'Admin'> = {
  READ: 'Ler',
  WRITE: 'Escrever',
  DELETE: 'Deletar',
  ADMIN: 'Admin',
};

export async function getAllActiveUsersAction(
  fields: UserFields = { id: true, email: true, employeeId: true },
  forSelect = false
): Promise<GetAllActiveUsersActionResult> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany({
        where: { active: true },
        select: {
          id: true,
          email: true,
          employeeId: true,
          ...(fields.userPermissions && !forSelect
            ? {
                userPermissions: {
                  select: {
                    module: true,
                    permission: true,
                  },
                },
              }
            : {}),
        },
      });

      if (users.length === 0) {
        throw new AppError(MESSAGE.USER.ALL_NOT_FOUND, 404);
      }

      if (forSelect) {
        return users.map(user => ({
          id: user.id,
          fullName: user.email,
        })) as IContributorToSelect[];
      }

      return users.map(user => ({
        id: user.id,
        email: user.email,
        contributorId: user.employeeId,
        userPermissions: (user.userPermissions as { module: string; permission: string }[] | undefined)?.map(perm => ({
          module: perm.module,
          permission: permissionMapping[perm.permission] || 'Ler',
        })) || [],
      })) as IUser[];
    });

    revalidatePath('/users');

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

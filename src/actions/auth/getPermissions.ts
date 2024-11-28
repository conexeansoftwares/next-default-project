'use server';

import { prisma } from '@/lib/prisma';
import { handleErrors } from '@/utils/handleErrors';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';

export interface Permission {
  module: string;
  permission: string;
}

export interface GetUserPermissionsResult {
  success: boolean;
  data?: Permission[];
  error?: unknown;
}

export async function getUserPermissionsAction(
  userId: number,
): Promise<GetUserPermissionsResult> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        active: true,
      },
      select: {
        userPermissions: {
          select: {
            module: true,
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(MESSAGE.USER.NOT_FOUND, 404);
    }

    return {
      success: true,
      data: user.userPermissions.map((up) => ({
        module: up.module,
        permission: up.permission,
      })),
    };
  } catch (error) {
    console.log(error);
    const errorResult = handleErrors(error);
    return {
      success: false,
      error: errorResult.error,
    };
  }
}

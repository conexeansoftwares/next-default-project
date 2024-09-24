'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { IUserToEdit, IUserPermission } from '@/app/(main)/users/types';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

const getUserSchema = z.string().cuid();

const permissionMapping: Record<string, IUserPermission['permission']> = {
  READ: 'Ler',
  WRITE: 'Escrever',
  DELETE: 'Deletar',
  ADMIN: 'Admin',
};

export interface IGetActiveUserByIdReturnProps {
  success: boolean;
  data?: IUserToEdit;
  error?: string;
} 

export const getActiveUserByIdAction = withPermissions(
  'users',
  'READ',
  async (userId: string): Promise<IGetActiveUserByIdReturnProps> => {
    try {
      const validatedId = getUserSchema.parse(userId);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: {
            id: validatedId,
            active: true,
          },
          include: {
            userPermissions: {
              select: {
                module: true,
                permission: true,
              },
            },
            employee: {
              include: {
                companies: {
                  select: {
                    companyId: true,
                  },
                },
              },
            },
          },
        });

        if (!user) {
          throw new AppError(MESSAGE.USER.NOT_FOUND, 404);
        }

        const formattedUser: IUserToEdit = {
          id: user.id,
          email: user.email,
          employeeId: user.employeeId,
          userPermissions: user.userPermissions.map((perm) => ({
            module: perm.module,
            permission: permissionMapping[perm.permission] || 'Ler',
          })),
          companyIds: user.employee.companies.map(
            (company) => company.companyId,
          ),
        };

        return formattedUser;
      });

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

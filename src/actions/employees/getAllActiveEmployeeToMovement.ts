'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { IEmployeeToMovement } from '@/app/(main)/employees/types';

export interface IGetAllACtiveEmplyeesToMovementReturnProps {
  success: boolean;
  data?: IEmployeeToMovement[];
  error?: string;
}

export const getAllActiveEmployeesToMovementAction = withPermissions(
  'employees',
  'READ',
  async (): Promise<IGetAllACtiveEmplyeesToMovementReturnProps> => {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const result = await tx.employee.findMany({
          select: {
            id: true,
            fullName: true,
            registration: true,
            observation: true,
            photoURL: true,
          },
          where: { active: true },
        });

        if (result.length === 0) {
          throw new AppError(MESSAGE.EMPLOYEE.ALL_NOT_FOUND, 404);
        }

        return result;
      });

      revalidatePath('/employees');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

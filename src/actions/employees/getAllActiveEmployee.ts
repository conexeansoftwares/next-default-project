'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { IEmployeeDataTable } from '@/app/(main)/employees/types';
import { Prisma } from '@prisma/client';

export interface IGetAllACtiveEmplyeesReturnProps {
  success: boolean;
  data?: IEmployeeDataTable[];
  error?: string;
}

export const getAllActiveEmployeesAction = withPermissions(
  'employees',
  'READ',
  async (): Promise<IGetAllACtiveEmplyeesReturnProps> => {
    try {
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const result = await tx.employee.findMany({
          select: {
            id: true,
            fullName: true,
            registration: true,
            companies: {
              select: {
                company: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
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

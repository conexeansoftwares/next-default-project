'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { IEmployeeToSelect } from '@/app/(main)/employees/types';
import { Prisma } from '@prisma/client';

export interface IGetAllACtiveEmplyeesToSelectReturnProps {
  success: boolean;
  data?: IEmployeeToSelect[];
  error?: string;
}

export const getAllActiveEmployeesToSelectAction =
  async (): Promise<IGetAllACtiveEmplyeesToSelectReturnProps> => {
    try {
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const result = await tx.employee.findMany({
          select: {
            id: true,
            fullName: true,
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
  };

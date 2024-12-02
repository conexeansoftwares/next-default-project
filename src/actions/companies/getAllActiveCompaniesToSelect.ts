'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { ICompany } from '@/app/(main)/companies/types';
import { handleErrors } from '@/utils/handleErrors';
import { Prisma } from '@prisma/client';

export interface IGetAllActiveCompaniesToSelectReturnProps {
  success: boolean;
  data?: Omit<ICompany, 'cnpj'>[];
  error?: string;
}

export const getAllActiveCompaniesToSelect =
  async (): Promise<IGetAllActiveCompaniesToSelectReturnProps> => {
    try {
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const companies = await tx.company.findMany({
          where: { active: true },
          select: {
            id: true,
            name: true,
          },
        });

        if (companies.length === 0) {
          throw new AppError(MESSAGE.COMPANY.ALL_NOT_FOUND, 404);
        }

        return companies;
      });

      revalidatePath('/companies');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  };

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { ICompany } from '@/app/(main)/companies/types';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { Prisma } from '@prisma/client';

export interface IGetAllActiveCompaniesReturnProps {
  success: boolean;
  data?: ICompany[];
  error?: string;
}

export const getAllActiveCompanies = withPermissions(
  'companies',
  'READ',
  async (): Promise<IGetAllActiveCompaniesReturnProps> => {
    try {
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const companies = await tx.company.findMany({
          where: { active: true },
          select: {
            id: true,
            name: true,
            cnpj: true,
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
  },
);

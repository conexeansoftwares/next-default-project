'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetActiveCompanyActionResult } from '@/app/(main)/companies/types';

const getCompanySchema = z.string().cuid();

export async function getActiveCompanyByIdAction(
  companyId: string
): Promise<GetActiveCompanyActionResult> {
  try {
    const validatedId = getCompanySchema.parse(companyId);
    
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        select: {
          id: true,
          name: true,
          cnpj: true,
        },
        where: {
          id: validatedId,
          active: true,
        },
      });

      if (!company) {
        throw new AppError(MESSAGE.COMPANY.NOT_FOUND, 404);
      }

      return company;
    });

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

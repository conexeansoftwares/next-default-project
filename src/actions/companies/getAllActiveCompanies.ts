'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetAllActiveCompanyActionResult } from '@/app/(main)/companies/types';

export async function getAllActiveCompanies(
  forSelect = false,
): Promise<GetAllActiveCompanyActionResult> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const companies = await tx.company.findMany({
        select: forSelect
          ? { id: true, name: true }
          : { id: true, name: true, cnpj: true },
        where: { active: true },
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
}

'use server';

import { prisma } from '../../lib/prisma';
import { CompanyFormData, companyFormSchema } from '../../schemas/companySchema';
import { removeCnpjMask } from '../../utils/cnpjUtils';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultCompanyActionResult } from '@/app/(main)/companies/types';

export async function editCompanyAction(companyId: string, data: CompanyFormData): Promise<DefaultCompanyActionResult> {
  try {
    const validatedData = companyFormSchema.parse(data);

    const { name, cnpj } = validatedData;

    const cleanCnpj = removeCnpjMask(cnpj);

    const result = await prisma.$transaction(async (tx) => {
      const existingCompany = await tx.company.findUnique({
        where: { id: companyId },
      });

      if (!existingCompany) {
        throw new AppError(MESSAGE.COMPANY.NOT_FOUND, 404);
      }

      const companyWithSameCnpj = await tx.company.findFirst({
        where: {
          cnpj: cleanCnpj,
          id: { not: companyId },
        },
      });

      if (companyWithSameCnpj) {
        throw new AppError(MESSAGE.COMPANY.EXISTING_CNPJ, 400);
      }

      await tx.company.update({
        where: { id: companyId },
        data: {
          name,
          cnpj: cleanCnpj,
        },
      });

      return MESSAGE.COMPANY.UPDATED_SUCCESS;
    });

    revalidatePath('/companies');

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

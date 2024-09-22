'use server';

import { AppError } from '@/error/appError';
import { prisma } from '../../lib/prisma';
import {
  CompanyFormData,
  companyFormSchema,
} from '../../schemas/companySchema';
import { removeCnpjMask } from '../../utils/cnpjUtils';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultCompanyActionResult } from '@/app/(main)/companies/types';

export async function createCompanyAction(
  data: CompanyFormData,
): Promise<DefaultCompanyActionResult> {
  try {
    const validatedData = companyFormSchema.parse(data);

    const { name, cnpj } = validatedData;

    const cleanCnpj = removeCnpjMask(cnpj);

    const existingCompany = await prisma.company.findUnique({
      where: { cnpj: cleanCnpj },
    });

    if (existingCompany) {
      throw new AppError(MESSAGE.COMPANY.EXISTING_CNPJ, 409);
    }

    await prisma.company.create({
      data: {
        name,
        cnpj: cleanCnpj,
      },
    });

    revalidatePath('/companies');

    return { success: true, message: MESSAGE.COMPANY.CREATED_SUCCESS };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

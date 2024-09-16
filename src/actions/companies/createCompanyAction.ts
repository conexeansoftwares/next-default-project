'use server';

import { prisma } from '@/lib/prisma';
import { CompanyFormData, companyFormSchema } from '@/schemas/companySchema';
import { removeCnpjMask } from '@/utils/cnpjUtils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function createCompanyAction(data: CompanyFormData) {
  try {
    const validatedData = companyFormSchema.parse(data);

    const { name, cnpj } = validatedData;

    const cleanCnpj = removeCnpjMask(cnpj);

    await prisma.company.create({
      data: {
        name,
        cnpj: cleanCnpj,
      },
    });

    revalidatePath('/companies');

    return { success: true, message: 'Empresa criada com sucesso' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, message: 'Ocorreu um erro ao criar a empresa' };
  }
}

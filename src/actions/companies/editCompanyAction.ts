'use server';

import { prisma } from '@/lib/prisma';
import { CompanyFormData, companyFormSchema } from '@/schemas/companySchema';
import { removeCnpjMask } from '@/utils/cnpjUtils';
import { revalidatePath } from 'next/cache';

export async function editCompanyAction(companyId: string, data: CompanyFormData) {
  try {
    const validatedData = companyFormSchema.parse(data);

    const { name, cnpj } = validatedData;

    const cleanCnpj = removeCnpjMask(cnpj);

    await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        cnpj: cleanCnpj,
      },
    });

    revalidatePath(`/companies/update/${companyId}`);

    return { success: true, message: 'Empresa atualizada com sucesso' };
  } catch (error) {
    return {
      success: false,
      message: 'Ocorreu um erro ao atualizar a empresa',
    };
  }
}

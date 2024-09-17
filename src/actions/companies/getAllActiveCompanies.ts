'use server';

import { revalidatePath } from 'next/cache';
import {
  ICompaniesReturnProps,
  ICompany,
} from '../../app/(main)/companies/types';
import { prisma } from '../../lib/prisma';

export async function getAllActiveCompanies(): Promise<ICompaniesReturnProps> {
  try {
    const companies: ICompany[] = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        cnpj: true,
      },
      where: { active: true },
    });

    revalidatePath('/companies');

    return { success: true, data: companies };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: 'Ocorreu um erro ao listar empresas.',
    };
  }
}

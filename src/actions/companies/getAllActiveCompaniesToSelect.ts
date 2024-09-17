'use server';

import { ICompaniesReturnToSelectProps, ICompanyToSelect } from '@/app/(main)/companies/types';
import { prisma } from '@/lib/prisma';

export async function getAllActiveCompaniesToSelect(): Promise<ICompaniesReturnToSelectProps> {
  try {
    const companies: ICompanyToSelect[] = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      where: { active: true },
    });

    return { success: true, data: companies };
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    return { success: false, data: [], message: 'Ocorreu um erro ao listar as empresas' };
  }
}
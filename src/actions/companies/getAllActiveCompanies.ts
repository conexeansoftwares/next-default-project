import { ICompaniesReturnProps, ICompany } from '@/app/(main)/companies/types';
import { prisma } from '@/lib/prisma';

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

    return { success: true, data: companies };
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    return { success: false, data: [], message: 'Ocorreu um erro ao listar as empresas' };
  }
}

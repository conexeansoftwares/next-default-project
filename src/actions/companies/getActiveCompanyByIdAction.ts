'use server';

import { ICompanyReturnProps, ICompany } from '../../app/(main)/companies/types';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const getCompanySchema = z.string().cuid();

export async function getActiveCompanyByIdAction(
  companyId: string,
): Promise<ICompanyReturnProps> {
  try {
    const validatedId = getCompanySchema.parse(companyId);
    
    const company: ICompany | null = await prisma.company.findUnique({
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
      return {
        success: false,
        data: null,
        message: 'Empresa não encontrada ou inativa',
      };
    }

    return { success: true, data: company };
  } catch (error) {
    console.log(error);
    console.error('Erro ao buscar empresa:', error);
    return {
      success: false,
      data: null,
      message: 'Ocorreu um erro ao buscar a empresa',
    };
  }
}

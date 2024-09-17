'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const deactivateCompanySchema = z.string().cuid();

export async function desactivateCompanyAction(companyId: string) {
  try {
    const validatedId = deactivateCompanySchema.parse(companyId);

    const company = await prisma.company.findUnique({
      where: { id: validatedId },
    });

    if (!company) {
      return { success: false, message: 'Empresa não encontrada' };
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.company.update({
        where: { id: validatedId },
        data: {
          active: false,
          deactivatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Empresa desativada com sucesso',
      };
    });

    revalidatePath('/companies');

    return result;
  } catch (error) {
    console.error('Erro ao desativar empresa:', error);
    if (error instanceof z.ZodError) {
      return { success: false, message: 'ID de empresa inválido' };
    }
    return {
      success: false,
      message: 'Ocorreu um erro ao desativar a empresa',
    };
  }
}

'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const deactivateContributorSchema = z.string().cuid();

export async function desactivateContributortion(contributorId: string) {
  try {
    const validatedId = deactivateContributorSchema.parse(contributorId);

    const contributor = await prisma.contributor.findUnique({
      where: { id: validatedId },
    });

    if (!contributor) {
      return { success: false, message: 'Colaborador não encontrado' };
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.contributor.update({
        where: { id: validatedId },
        data: {
          active: false,
          deactivatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Colaborador desativado com sucesso',
      };
    });

    revalidatePath('/contributors');

    return result;
  } catch (error) {
    console.log(error);
    console.error('Erro ao desativar colaborador:', error);
    if (error instanceof z.ZodError) {
      return { success: false, message: 'ID do colaborador inválido' };
    }
    return {
      success: false,
      message: 'Ocorreu um erro ao desativar o colaborador',
    };
  }
}

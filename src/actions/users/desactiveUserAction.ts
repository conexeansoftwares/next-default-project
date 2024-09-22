'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const deactivateUserSchema = z.string().cuid();

export async function desactivateUserAction(userId: string) {
  try {
    const validatedId = deactivateUserSchema.parse(userId);

    const user = await prisma.user.findUnique({
      where: { id: validatedId },
    });

    if (!user) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: validatedId },
        data: {
          active: false,
          deactivatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Usuário desativado com sucesso',
      };
    });

    revalidatePath('/users');

    return result;
  } catch (error) {
    console.log(error);
    console.error('Erro ao desativar usuario:', error);
    if (error instanceof z.ZodError) {
      return { success: false, message: 'ID do usuario inválido' };
    }
    return {
      success: false,
      message: 'Ocorreu um erro ao desativar o usuario',
    };
  }
}

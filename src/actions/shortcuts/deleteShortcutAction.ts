'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const deleteShortcutSchema = z.string().cuid();

export async function deleteShortcutAction(shortcutId: string) {
  try {
    const validatedId = deleteShortcutSchema.parse(shortcutId);

    await prisma.shortcut.delete({
      where: { id: validatedId },
    });

    revalidatePath('/shortcurts');

    return { success: true, message: 'Atalho deletado com sucesso.' };
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

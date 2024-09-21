'use server';

import { ShortcutFormData, shortcutFormSchema } from '@/schemas/shortcutSchema';
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function editShortcutAction(
  shortcutId: string,
  data: ShortcutFormData,
) {
  try {
    const validatedData = shortcutFormSchema.parse(data);

    const { url, label, color } = validatedData;

    await prisma.shortcut.update({
      where: { id: shortcutId },
      data: {
        url,
        label,
        color,
      },
    });

    revalidatePath('/shortcuts');

    return { success: true, message: 'Atalho atualizado com sucesso' };
  } catch (error) {
    return {
      success: false,
      message: 'Ocorreu um erro ao atualizar o atalho',
    };
  }
}

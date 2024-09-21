'use server';

import { ShortcutFormData, shortcutFormSchema } from '@/schemas/shortcutSchema';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function createShortcutAction(data: ShortcutFormData) {
  try {
    const validatedData = shortcutFormSchema.parse(data);

    const { url, label, color } = validatedData;
    console.log(color);

    await prisma.shortcut.create({
      data: {
        url,
        label,
        color,
      },
    });

    revalidatePath('/shortcuts');

    return { success: true, message: 'Atalho criado com sucesso' };
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, message: 'Ocorreu um erro ao criar o atalho' };
  }
}

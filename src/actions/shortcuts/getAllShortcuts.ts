'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { IShortcut, IShortcutsReturnProps } from '@/app/(main)/shortcuts/types';

export async function getAllShortcuts(): Promise<IShortcutsReturnProps> {
  try {
    const shortcuts: IShortcut[] = await prisma.shortcut.findMany({
      select: {
        id: true,
        url: true,
        label: true,
        color: true,
      },
    });

    revalidatePath('/shortcuts');

    return { success: true, data: shortcuts };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: 'Ocorreu um erro ao listar atalhos.',
    };
  }
}

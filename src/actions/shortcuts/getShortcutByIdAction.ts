'use server';

import { IShortcut, IShortcutReturnProps } from '@/app/(main)/shortcuts/types';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const getShortcutSchema = z.string().cuid();

export async function getShortcutByIdAction(
  shortcutId: string,
): Promise<IShortcutReturnProps> {
  try {
    const validatedId = getShortcutSchema.parse(shortcutId);
    
    const shortcut: IShortcut | null = await prisma.shortcut.findUnique({
      select: {
        id: true,
        url: true,
        label: true,
        color: true,
      },
      where: {
        id: validatedId,
      },
    });

    if (!shortcut) {
      return {
        success: false,
        data: null,
        message: 'Atalho não encontrado ou inativo',
      };
    }

    return { success: true, data: shortcut };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: 'Ocorreu um erro ao buscar o atalho',
    };
  }
}

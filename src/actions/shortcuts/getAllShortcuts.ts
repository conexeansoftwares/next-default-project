'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import {
  GetAllShortcutsActionResult,
  IShortcut,
} from '@/app/(main)/shortcuts/types';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';

export async function getAllShortcuts(): Promise<GetAllShortcutsActionResult> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const shortcuts: IShortcut[] = await tx.shortcut.findMany({
        select: {
          id: true,
          url: true,
          label: true,
          color: true,
        },
      });

      if (shortcuts.length === 0) {
        throw new AppError(MESSAGE.SHORTCUT.ALL_NOT_FOUND);
      }

      return shortcuts;
    });

    revalidatePath('/shortcuts');

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

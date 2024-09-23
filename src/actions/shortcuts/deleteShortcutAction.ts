'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultShortcutActionResult } from '@/app/(main)/shortcuts/types';

const deleteShortcutSchema = z.string().cuid();

export async function deleteShortcutAction(
  shortcutId: string,
): Promise<DefaultShortcutActionResult> {
  try {
    const validatedId = deleteShortcutSchema.parse(shortcutId);

    const result = await prisma.$transaction(async (tx) => {
      const shortcurt = await tx.shortcut.findUnique({
        where: { id: validatedId },
      });

      if (!shortcurt) {
        throw new AppError(MESSAGE.SHORTCUT.NOT_FOUND, 404);
      }

      await tx.shortcut.delete({
        where: { id: validatedId },
      });

      return MESSAGE.SHORTCUT.DELETED_SUCCESS;
    });

    revalidatePath('/shortcurts');

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

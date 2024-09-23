'use server';

import {
  GetShortcutActionResult,
} from '@/app/(main)/shortcuts/types';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';

const getShortcutSchema = z.string().cuid();

export async function getShortcutByIdAction(
  shortcutId: string,
): Promise<GetShortcutActionResult> {
  try {
    const validatedId = getShortcutSchema.parse(shortcutId);

    const result = await prisma.$transaction(async (tx) => {
      const shortcurt = await tx.shortcut.findUnique({
        where: { id: validatedId },
        select: {
          id: true,
          url: true,
          label: true,
          color: true,
        },
      });

      if (!shortcurt) {
        throw new AppError(MESSAGE.SHORTCUT.NOT_FOUND, 404);
      }

      return shortcurt;
    });

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

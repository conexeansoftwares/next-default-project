'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';

export interface IDeleteShortcutReturnProps {
  success: boolean,
  data?: string,
  error?: string,
}

const deleteShortcutSchema = z.string().cuid();

export const deleteShortcutAction = withPermissions('shortcuts', 'DELETE',
  async (shortcutId: string): Promise<IDeleteShortcutReturnProps> => {
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

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  });

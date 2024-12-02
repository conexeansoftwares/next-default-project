'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { idSchema } from '@/schemas/idSchema';
import { Prisma } from '@prisma/client';

export interface IDeleteShortcutReturnProps {
  success: boolean,
  data?: string,
  error?: string,
}

export const deleteShortcutAction = withPermissions('shortcuts', 'DELETE',
  async (shortcutId: number): Promise<IDeleteShortcutReturnProps> => {
    try {
      const validatedId = idSchema.parse(shortcutId);

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

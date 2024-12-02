'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { IShortcut } from '@/app/(main)/shortcuts/types';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware'; 
import { handleErrors } from '@/utils/handleErrors';
import { Prisma } from '@prisma/client';

export interface IGetAllShortcutsReturnProps {
  success: boolean;
  data?: IShortcut[];
  error?: string;
}

export const getAllShortcuts = withPermissions('shortcuts', 'READ', async (): Promise<IGetAllShortcutsReturnProps> => {
  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
});

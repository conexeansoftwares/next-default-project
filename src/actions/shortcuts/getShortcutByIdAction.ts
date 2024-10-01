'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { IShortcut } from '@/app/(main)/shortcuts/types';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';

export interface IGetShortcutByIdReturnProps {
  success: boolean,
  data?: IShortcut,
  error?: string,
}

export const getShortcutByIdAction = withPermissions('shortcuts', 'READ',
  async (shortcutId: number): Promise<IGetShortcutByIdReturnProps> => {
    try {
      const validatedId = idSchema.parse(shortcutId);

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
  });

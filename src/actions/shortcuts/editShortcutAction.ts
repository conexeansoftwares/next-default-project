'use server';

import { ShortcutFormData, shortcutFormSchema } from '@/schemas/shortcutSchema';
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';

interface EditShortcutActionParams {
  shortcutId: string;
  data: ShortcutFormData;
}

export interface IEditShortcutReturnProps {
  success: boolean,
  data?: string,
  error?: string,
}

export const editShortcutAction = withPermissions('shortcuts', 'WRITE',
  async (params: EditShortcutActionParams): Promise<IEditShortcutReturnProps> => {
    try {
      const { shortcutId, data } = params;
      const validatedData = shortcutFormSchema.parse(data);

      const { url, label, color } = validatedData;

      const result = await prisma.$transaction(async (tx) => {
        const shortcurt = await tx.shortcut.findUnique({
          where: { id: shortcutId },
        });

        if (!shortcurt) {
          throw new AppError(MESSAGE.SHORTCUT.NOT_FOUND, 404);
        }

        await tx.shortcut.update({
          where: { id: shortcutId },
          data: {
            url,
            label,
            color,
          },
        });

        return MESSAGE.SHORTCUT.UPDATED_SUCCESS;
      });

      revalidatePath('/shortcuts');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  });

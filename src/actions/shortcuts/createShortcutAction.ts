'use server';

import { ShortcutFormData, shortcutFormSchema } from '@/schemas/shortcutSchema';
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';

export interface ICreateShortcutReturnProps {
  success: boolean,
  data?: string;
  error?: string;
}

export const createShortcutAction = withPermissions('shortcuts', 'WRITE',
  async (data: ShortcutFormData): Promise<ICreateShortcutReturnProps> => {
    try {
      const validatedData = shortcutFormSchema.parse(data);

      const { url, label, color } = validatedData;

      const result = await prisma.$transaction(async (tx) => {
        await tx.shortcut.create({
          data: {
            url,
            label,
            color,
          },
        });

        return MESSAGE.SHORTCUT.CREATED_SUCCESS;
      });

      revalidatePath('/shortcuts');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  });

'use server';

import { ShortcutFormData, shortcutFormSchema } from '@/schemas/shortcutSchema';
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultShortcutActionResult } from '@/app/(main)/shortcuts/types';

export async function createShortcutAction(
  data: ShortcutFormData,
): Promise<DefaultShortcutActionResult> {
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

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

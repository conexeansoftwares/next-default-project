'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultUserActionResult } from '@/app/(main)/users/types';
import { hash } from 'bcryptjs';
import { passwordSchema, type PasswordFormSchema } from '@/schemas/userSchema';

export async function updateUserPasswordAction(
  userId: string,
  data: PasswordFormSchema
): Promise<DefaultUserActionResult> {
  try {
    const validatedData = passwordSchema.parse(data);

    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new AppError(MESSAGE.USER.NOT_FOUND, 404);
      }

      const hashedPassword = await hash(validatedData.password, 10);

      await tx.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });

      return MESSAGE.USER.PASSWORD_UPDATED_SUCCESS;
    });

    revalidatePath('/users');

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

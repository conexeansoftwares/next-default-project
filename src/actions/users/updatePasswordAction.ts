'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { hash } from 'bcryptjs';
import { passwordSchema, type PasswordFormSchema } from '@/schemas/userSchema';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';
import { Prisma } from '@prisma/client';

interface EditPasswordActionParams {
  userId: number;
  data: PasswordFormSchema;
}

export interface IUpdateUserReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const updateUserPasswordAction = withPermissions(
  'users',
  'WRITE',
  async (params: EditPasswordActionParams): Promise<IUpdateUserReturnProps> => {
    try {
      const { userId, data } = params;

      const validatedId = idSchema.parse(userId);
      const validatedData = passwordSchema.parse(data);

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const existingUser = await tx.user.findUnique({
          where: { id: validatedId },
        });

        if (!existingUser) {
          throw new AppError(MESSAGE.USER.NOT_FOUND, 404);
        }

        const hashedPassword = await hash(validatedData.password, 10);

        await tx.user.update({
          where: { id: validatedId },
          data: {
            password: hashedPassword,
          },
        });

        return MESSAGE.USER.PASSWORD_UPDATED_SUCCESS;
      });

      revalidatePath('/users');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

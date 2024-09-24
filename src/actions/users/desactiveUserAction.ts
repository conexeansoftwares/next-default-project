'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

export interface IDeactiveUserReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

const deactivateUserSchema = z.string().cuid();

export const deactivateUserAction = withPermissions(
  'users',
  'DELETE',
  async (userId: string): Promise<IDeactiveUserReturnProps> => {
    try {
      const validatedId = deactivateUserSchema.parse(userId);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: validatedId, active: true },
        });

        if (!user) {
          throw new AppError(MESSAGE.USER.NOT_FOUND, 404);
        }

        await tx.user.update({
          where: { id: validatedId },
          data: {
            active: false,
            deactivatedAt: new Date(),
          },
        });

        return MESSAGE.USER.DEACTIVATED_SUCCESS;
      });

      revalidatePath('/users');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

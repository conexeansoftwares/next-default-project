'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetVisitorMovementsByDateActionResult, IVisitorMovementSimplified } from '@/app/(main)/movement/types';

const getVisitorMovementSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inicial inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data final inválida',
  }),
});

export async function getVisitorMovementByDateAction(
  startDate: string,
  endDate: string
): Promise<GetVisitorMovementsByDateActionResult> {
  try {
    const validatedData = getVisitorMovementSchema.parse({
      startDate,
      endDate,
    });

    const startDateTime = new Date(validatedData.startDate);
    const endDateTime = new Date(validatedData.endDate);

    endDateTime.setHours(23, 59, 59, 999);

    const result = await prisma.$transaction(async (tx) => {
      const movements = await tx.visitorMovement.findMany({
        where: {
          createdAt: {
            gte: startDateTime,
            lte: endDateTime,
          },
        },
        select: {
          fullName: true,
          cpf: true,
          telephone: true,
          licensePlate: true,
          action: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (movements.length === 0) {
        throw new AppError(MESSAGE.VISITOR_MOVEMENT.NOT_FOUND, 404);
      }

      return movements.map((movement): IVisitorMovementSimplified => ({
        fullName: movement.fullName,
        cpf: movement.cpf,
        telephone: movement.telephone,
        licensePlate: movement.licensePlate,
        action: movement.action,
        date: movement.createdAt.toISOString(),
      }));
    });

    revalidatePath('/historical');

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

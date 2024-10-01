'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { IVisitorMovementSimplified } from '@/app/(main)/movements/types';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

const getVisitorMovementSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inicial inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data final inválida',
  }),
});

interface GetVisitorMovementActionParams {
  startDate: string;
  endDate: string;
}

export interface IGetVisitorMovementByDate {
  success: boolean;
  data?: IVisitorMovementSimplified[];
  error?: string;
}

export const getVisitorMovementByDateAction = withPermissions(
  'movements',
  'READ',
  async (
    params: GetVisitorMovementActionParams,
  ): Promise<IGetVisitorMovementByDate> => {
    try {
      const { startDate, endDate } = params;
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
            observation: true,
            companies: {
              select: {
                company: {
                  select: {
                    name: true,
                  },
                },
              },
            },
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

        return movements.map(
          (movement): IVisitorMovementSimplified => ({
            fullName: movement.fullName,
            cpf: movement.cpf,
            telephone: movement.telephone,
            licensePlate: movement.licensePlate,
            observation: movement.observation,
            companies: movement.companies,
            action: movement.action,
            date: movement.createdAt.toISOString(),
          }),
        );
      });

      revalidatePath('/historical');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

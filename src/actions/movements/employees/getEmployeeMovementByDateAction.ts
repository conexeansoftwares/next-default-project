'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { IEmployeeMovementDetail } from '@/app/(main)/movements/types';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

const getEmployeeMovementSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inicial inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data final inválida',
  }),
});

interface EmployeeMovementActionParams {
  startDate: string;
  endDate: string;
}

export interface IGetEmployeeMovementByDateReturnProps {
  success: boolean;
  data?: IEmployeeMovementDetail[];
  error?: string;
}

export const getEmployeeMovementsByDateAction = withPermissions(
  'movements',
  'READ',
  async (
    params: EmployeeMovementActionParams,
  ): Promise<IGetEmployeeMovementByDateReturnProps> => {
    try {
      const { startDate, endDate } = params;

      const validatedData = getEmployeeMovementSchema.parse({
        startDate,
        endDate,
      });

      const startDateTime = new Date(validatedData.startDate);
      const endDateTime = new Date(validatedData.endDate);

      endDateTime.setHours(23, 59, 59, 999);

      const result = await prisma.$transaction(async (tx) => {
        const movements = await tx.employeeMovement.findMany({
          where: {
            createdAt: {
              gte: startDateTime,
              lte: endDateTime,
            },
          },
          select: {
            action: true,
            createdAt: true,
            observation: true,
            employee: {
              select: {
                fullName: true,
                registration: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

        if (movements.length === 0) {
          throw new AppError(MESSAGE.EMPLOYEE_MOVEMENT.NOT_FOUND, 404);
        }

        return movements.map((movement) => ({
          fullName: movement.employee.fullName,
          registration: movement.employee.registration,
          observation: movement.observation,
          action: movement.action,
          date: movement.createdAt.toISOString(),
        }));
      });

      revalidatePath('/historical');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

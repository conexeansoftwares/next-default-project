'use server';

import { Action } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

const createEmployeeMovementSchema = z.object({
  employeeId: z.string().cuid({ message: 'ID do colaborador inválido' }),
  action: z.enum(['E', 'S']),
});

interface CreateEmployeMovementActionParams {
  employeeId: string;
  action: string;
}

export interface ICreateEmployeeMovementReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const createEmployeeMovementAction = withPermissions(
  'movements',
  'WRITE',
  async (params: CreateEmployeMovementActionParams): Promise<ICreateEmployeeMovementReturnProps> => {
    try {
      const { employeeId, action } = params;

      const validatedData = createEmployeeMovementSchema.parse({
        employeeId,
        action,
      });

      await prisma.$transaction(async (tx) => {
        const existingEmployee = await tx.employee.findUnique({
          where: { id: validatedData.employeeId },
        });

        if (!existingEmployee) {
          throw new AppError(MESSAGE.EMPLOYEE.NOT_FOUND, 404);
        }

        await tx.employeeMovement.create({
          data: {
            employeeId: validatedData.employeeId,
            action: validatedData.action as Action,
          },
        });
      });

      revalidatePath('/movements');

      return { success: true, data: MESSAGE.EMPLOYEE_MOVEMENT.CREATED_SUCCESS };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

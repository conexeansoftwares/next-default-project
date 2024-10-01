'use server';

import { Action } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';
import { actionSchema } from '@/schemas/actionSchema';
import { observationSchema } from '@/schemas/observationSchema';

interface CreateEmployeMovementActionParams {
  employeeId: number;
  observation: string;
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
      const { employeeId, observation, action } = params;

      const validatedAction = actionSchema.parse(action);
      const validatedObservation = observationSchema.parse(observation);
      const validatedId = idSchema.parse(employeeId);

      await prisma.$transaction(async (tx) => {
        const existingEmployee = await tx.employee.findUnique({
          where: { id: validatedId },
        });

        if (!existingEmployee) {
          throw new AppError(MESSAGE.EMPLOYEE.NOT_FOUND, 404);
        }

        await tx.employeeMovement.create({
          data: {
            employeeId: validatedId,
            observation: validatedObservation,
            action: validatedAction as Action,
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

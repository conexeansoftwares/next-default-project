'use server';

import { Action } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultEmployeeMovementActionResult } from '@/app/(main)/movement/types';

const createEmployeeMovementSchema = z.object({
  employeeId: z.string().cuid(),
  action: z.enum(['E', 'S']),
});

export async function createEmployeeMovementAction(
  employeeId: string,
  action: string,
): Promise<DefaultEmployeeMovementActionResult> {
  try {
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

      const movement = await tx.employeeMovement.create({
        data: {
          employeeId: validatedData.employeeId,
          action: validatedData.action as Action,
        },
      });

      return movement;
    });

    revalidatePath('/movements');

    return {
      success: true,
      message: MESSAGE.EMPLOYEE_MOVEMENT.CREATED_SUCCESS,
    };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

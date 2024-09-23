'use server';

import { Action } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultActionResult } from '@/app/(main)/movement/types';

const createVehicleMovementSchema = z.object({
  vehicleId: z.string().cuid(),
  action: z.enum(['E', 'S']),
});

export async function createVehicleMovementAction(
  vehicleId: string,
  action: string
): Promise<DefaultActionResult> {
  try {
    const validatedData = createVehicleMovementSchema.parse({
      vehicleId,
      action,
    });

    await prisma.$transaction(async (tx) => {
      const existingVehicle = await tx.vehicle.findUnique({
        where: { id: validatedData.vehicleId },
      });

      if (!existingVehicle) {
        throw new AppError(MESSAGE.VEHICLE.NOT_FOUND, 404);
      }

      const movement = await tx.vehicleMovement.create({
        data: {
          vehicleId: validatedData.vehicleId,
          action: validatedData.action as Action,
        },
      });

      return movement;
    });

    revalidatePath('/movements');

    return {
      success: true,
      message: MESSAGE.VEHICLE_MOVEMENT.CREATED_SUCCESS,
    };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

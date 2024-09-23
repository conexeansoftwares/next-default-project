'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultVehicleActionResult } from '@/app/(main)/vehicles/types';

const deactivateVehicleSchema = z.string().cuid();

export async function deactivateVehicleAction(vehicleId: string): Promise<DefaultVehicleActionResult> {
  try {
    const validatedId = deactivateVehicleSchema.parse(vehicleId);

    const result = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: validatedId, active: true },
      });

      if (!vehicle) {
        throw new AppError(MESSAGE.VEHICLE.NOT_FOUND, 404);
      }

      await tx.vehicle.update({
        where: { id: validatedId },
        data: {
          active: false,
          deactivatedAt: new Date(),
        },
      });

      return MESSAGE.VEHICLE.DEACTIVATED_SUCCESS;
    });

    revalidatePath('/vehicles');

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

'use server';

import { prisma } from '../../lib/prisma';
import { VehicleFormData, vehicleFormSchema } from '../../schemas/vehicleSchema';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultVehicleActionResult } from '@/app/(main)/vehicles/types';

export async function editVehicleAction(vehicleId: string, data: VehicleFormData): Promise<DefaultVehicleActionResult> {
  try {
    const validatedData = vehicleFormSchema.parse(data);

    const { licensePlate, carModel, owner, companyId } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
      const existingVehicle = await tx.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!existingVehicle) {
        throw new AppError(MESSAGE.VEHICLE.NOT_FOUND, 404);
      }

      const vehicleWithSameLicensePlate = await tx.vehicle.findFirst({
        where: {
          licensePlate,
          id: { not: vehicleId },
        },
      });

      if (vehicleWithSameLicensePlate) {
        throw new AppError(MESSAGE.VEHICLE.EXISTING_LICENSE_PLATE, 400);
      }

      await tx.vehicle.update({
        where: { id: vehicleId },
        data: {
          licensePlate,
          carModel,
          owner,
          companyId,
        },
      });

      return MESSAGE.VEHICLE.UPDATED_SUCCESS;
    });

    revalidatePath('/vehicles');

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

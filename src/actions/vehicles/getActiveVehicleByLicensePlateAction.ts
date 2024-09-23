'use server';

import { prisma } from '../../lib/prisma';
import { vehicleFormSchema } from '../../schemas/vehicleSchema';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetVehicleActionResult } from '@/app/(main)/vehicles/types';

const getLicensePlateSchema = vehicleFormSchema.shape.licensePlate;

export async function getActiveVehicleByLicensePlateAction(
  licensePlate: string
): Promise<GetVehicleActionResult> {
  try {
    const validatedLicensePlate = getLicensePlateSchema.parse(licensePlate);
    
    const result = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
        select: {
          id: true,
          licensePlate: true,
          carModel: true,
          owner: true,
          companyId: true,
          company: {
            select: {
              name: true,
            },
          },
        },
        where: {
          licensePlate: validatedLicensePlate,
          active: true,
        },
      });

      if (!vehicle) {
        throw new AppError(MESSAGE.VEHICLE.NOT_FOUND, 404);
      }

      return {
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        owner: vehicle.owner,
        carModel: vehicle.carModel,
        companyId: vehicle.companyId,
        companyName: vehicle.company.name,
      };
    });

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

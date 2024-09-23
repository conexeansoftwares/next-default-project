'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetVehicleActionResult } from '@/app/(main)/vehicles/types';

const getVehicleSchema = z.string().cuid();

export async function getActiveVehicleByIdAction(
  vehicleId: string
): Promise<GetVehicleActionResult> {
  try {
    const validatedId = getVehicleSchema.parse(vehicleId);
    
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
          id: validatedId,
          active: true,
        },
      });

      if (!vehicle) {
        throw new AppError(MESSAGE.VEHICLE.NOT_FOUND, 404);
      }

      return {
        ...vehicle,
        companyName: vehicle.company.name,
      };
    });

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

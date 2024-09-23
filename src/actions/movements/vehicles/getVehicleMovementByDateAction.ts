'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetVehicleMovementActionResult } from '@/app/(main)/movement/types';

const getVehicleMovementSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inicial inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data final inválida',
  }),
});

export async function getVehicleMovementByDateAction(
  startDate: string,
  endDate: string
): Promise<GetVehicleMovementActionResult> {
  try {
    const validatedData = getVehicleMovementSchema.parse({
      startDate,
      endDate,
    });

    const startDateTime = new Date(validatedData.startDate);
    const endDateTime = new Date(validatedData.endDate);

    endDateTime.setHours(23, 59, 59, 999);

    const result = await prisma.$transaction(async (tx) => {
      const movements = await tx.vehicleMovement.findMany({
        where: {
          createdAt: {
            gte: startDateTime,
            lte: endDateTime,
          },
        },
        select: {
          action: true,
          createdAt: true,
          vehicle: {
            select: {
              licensePlate: true,
              carModel: true,
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (movements.length === 0) {
        throw new AppError(MESSAGE.VEHICLE_MOVEMENT.NOT_FOUND, 404);
      }

      return movements.map((movement) => ({
        licensePlate: movement.vehicle.licensePlate,
        carModel: movement.vehicle.carModel,
        companyName: movement.vehicle.company.name,
        action: movement.action,
        date: movement.createdAt.toISOString(),
      }));
    });

    revalidatePath('/historical');

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

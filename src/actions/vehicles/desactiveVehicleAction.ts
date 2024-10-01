'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';

export interface IDeactiveVehicleReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const deactivateVehicleAction = withPermissions(
  'vehicles',
  'DELETE',
  async (vehicleId: number): Promise<IDeactiveVehicleReturnProps> => {
    try {
      const validatedId = idSchema.parse(vehicleId);

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

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

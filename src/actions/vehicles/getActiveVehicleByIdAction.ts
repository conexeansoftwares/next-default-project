'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { IVehicle } from '@/app/(main)/movements/types';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idVehicleSchema } from '@/schemas/vehicleSchema';

export interface IGetActiveVehicleByIdReturnProps {
  success: boolean;
  data?: IVehicle;
  error?: string;
}

export const getActiveVehicleByIdAction = withPermissions(
  'vehicles',
  'READ',
  async (vehicleId: string): Promise<IGetActiveVehicleByIdReturnProps> => {
    try {
      const validatedId = idVehicleSchema.parse(vehicleId);

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
  },
);

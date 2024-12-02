'use server';

import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';
import { IVehicle } from '@/app/(main)/vehicles/types';
import { Prisma } from '@prisma/client';

export interface IGetActiveVehicleByIdReturnProps {
  success: boolean;
  data?: IVehicle;
  error?: string;
}

export const getActiveVehicleByIdAction = withPermissions(
  'vehicles',
  'READ',
  async (vehicleId: number): Promise<IGetActiveVehicleByIdReturnProps> => {
    try {
      const validatedId = idSchema.parse(vehicleId);

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { IVehicle } from '@/app/(main)/vehicles/types';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { Prisma } from '@prisma/client';

export interface IGetAllActiveVehiclesReturnProps {
  success: boolean;
  data?: IVehicle[];
  error?: string;
}

export const getAllActiveVehiclesAction = withPermissions(
  'vehicles',
  'READ',
  async (): Promise<IGetAllActiveVehiclesReturnProps> => {
    try {
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const vehicles = await tx.vehicle.findMany({
          select: {
            id: true,
            licensePlate: true,
            carModel: true,
            owner: true,
            companyId: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: { active: true },
        });

        if (vehicles.length === 0) {
          throw new AppError(MESSAGE.VEHICLE.ALL_NOT_FOUND, 404);
        }

        const formattedVehicles: IVehicle[] = vehicles.map((vehicle) => ({
          id: vehicle.id,
          licensePlate: vehicle.licensePlate,
          owner: vehicle.owner,
          carModel: vehicle.carModel,
          companyId: vehicle.companyId,
          companyName: vehicle.company ? vehicle.company.name : '',
        }));

        return formattedVehicles;
      });

      revalidatePath('/vehicles');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

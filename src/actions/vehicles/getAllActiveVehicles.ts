'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetAllVehiclesActionResult, IVehicle, IVehicleSelect } from '@/app/(main)/vehicles/types';

type VehicleFields = {
  id?: boolean;
  licensePlate?: boolean;
  owner?: boolean;
  carModel?: boolean;
  companyId?: boolean;
  company?: boolean;
};

export async function getAllActiveVehiclesAction(
  fields: VehicleFields = { id: true, licensePlate: true, owner: true },
  forSelect = false
): Promise<GetAllVehiclesActionResult> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      if (forSelect) {
        const vehicles = await tx.vehicle.findMany({
          select: { id: true, licensePlate: true, owner: true },
          where: { active: true },
        });

        if (vehicles.length === 0) {
          throw new AppError(MESSAGE.VEHICLE.ALL_NOT_FOUND, 404);
        }

        return vehicles as IVehicleSelect[];
      } else {
        const vehicles = await tx.vehicle.findMany({
          select: {
            ...fields,
            company: fields.company
              ? {
                  select: {
                    id: true,
                    name: true,
                  },
                }
              : undefined,
          },
          where: { active: true },
        });

        if (vehicles.length === 0) {
          throw new AppError(MESSAGE.VEHICLE.ALL_NOT_FOUND, 404);
        }

        const formattedVehicles: IVehicle[] = vehicles.map(vehicle => ({
          id: vehicle.id,
          licensePlate: vehicle.licensePlate,
          owner: vehicle.owner,
          carModel: vehicle.carModel,
          companyId: vehicle.companyId,
          companyName: vehicle.company ? vehicle.company.name : '',
        }));

        return formattedVehicles;
      }
    });

    revalidatePath('/vehicles');

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

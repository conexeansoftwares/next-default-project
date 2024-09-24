'use server';

import { AppError } from '@/error/appError';
import { prisma } from '../../lib/prisma';
import {
  VehicleFormData,
  vehicleFormSchema,
} from '../../schemas/vehicleSchema';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

export interface ICreateVehicleReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const createVehicleAction = withPermissions(
  'vehicles',
  'WRITE',
  async (data: VehicleFormData): Promise<ICreateVehicleReturnProps> => {
    try {
      const validatedData = vehicleFormSchema.parse(data);

      const { licensePlate, carModel, owner, companyId } = validatedData;

      const result = await prisma.$transaction(async (tx) => {
        const existingVehicle = await tx.vehicle.findUnique({
          where: { licensePlate },
        });

        if (existingVehicle) {
          throw new AppError(MESSAGE.VEHICLE.EXISTING_LICENSE_PLATE, 409);
        }

        await tx.vehicle.create({
          data: {
            licensePlate,
            carModel,
            owner,
            companyId,
          },
        });

        return MESSAGE.VEHICLE.CREATED_SUCCESS;
      });

      revalidatePath('/vehicles');
      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

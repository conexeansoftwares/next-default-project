'use server';

import { prisma } from '../../lib/prisma';
import {
  VehicleFormData,
  vehicleFormSchema,
} from '../../schemas/vehicleSchema';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';

interface EditVehicleActionParams {
  vehicleId: number;
  data: VehicleFormData;
}

export interface IEditVehicleReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const editVehicleAction = withPermissions(
  'vehicles',
  'WRITE',
  async (params: EditVehicleActionParams): Promise<IEditVehicleReturnProps> => {
    try {
      const { vehicleId, data } = params;
      
      const validatedId = idSchema.parse(vehicleId);
      const validatedData = vehicleFormSchema.parse(data);

      const { licensePlate, carModel, owner, companyId } = validatedData;

      const result = await prisma.$transaction(async (tx) => {
        const existingVehicle = await tx.vehicle.findUnique({
          where: { id: validatedId },
        });

        if (!existingVehicle) {
          throw new AppError(MESSAGE.VEHICLE.NOT_FOUND, 404);
        }

        const vehicleWithSameLicensePlate = await tx.vehicle.findFirst({
          where: {
            licensePlate,
            id: { not: validatedId },
          },
        });

        if (vehicleWithSameLicensePlate) {
          throw new AppError(MESSAGE.VEHICLE.EXISTING_LICENSE_PLATE, 400);
        }

        await tx.vehicle.update({
          where: { id: validatedId },
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

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

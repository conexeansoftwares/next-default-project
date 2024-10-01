'use server';

import { Action } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';
import { actionSchema } from '@/schemas/actionSchema';
import { observationSchema } from '@/schemas/observationSchema';

interface CreateVehicleMovementActionParams {
  vehicleId: number;
  observation: string;
  action: string;
}

export interface ICreateVehicleMovementReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const createVehicleMovementAction = withPermissions(
  'movements',
  'WRITE',
  async (params: CreateVehicleMovementActionParams): Promise<ICreateVehicleMovementReturnProps> => {
    try {
      const { vehicleId, observation, action } = params;

      const validatedId = idSchema.parse(vehicleId);
      const validatedObservation = observationSchema.parse(observation); 
      const validatedAction = actionSchema.parse(action);

      await prisma.$transaction(async (tx) => {
        const existingVehicle = await tx.vehicle.findUnique({
          where: { id: validatedId },
        });

        if (!existingVehicle) {
          throw new AppError(MESSAGE.VEHICLE.NOT_FOUND, 404);
        }

        const movement = await tx.vehicleMovement.create({
          data: {
            vehicleId: validatedId,
            observation: validatedObservation,
            action: validatedAction as Action,
          },
        });

        return movement;
      });

      revalidatePath('/movements');

      return { success: true, data: MESSAGE.VEHICLE_MOVEMENT.CREATED_SUCCESS };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

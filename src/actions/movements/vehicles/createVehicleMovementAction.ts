'use server';

import { Action } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createVehicleMovementSchema = z.object({
  vehicleId: z.string().cuid(),
  action: z.enum(['E', 'S']),
});

export async function createVehicleMovementAction(
  vehicleId: string,
  action: string,
) {
  try {
    const validatedData = createVehicleMovementSchema.parse({
      vehicleId,
      action,
    });

    const movement = await prisma.vehicleMovement.create({
      data: {
        vehicleId: validatedData.vehicleId,
        action: validatedData.action as Action,
      },
    });

    revalidatePath('/movements');

    return {
      success: true,
      message: 'Movimentação criada com sucesso',
      data: movement,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: 'Ocorreu um erro ao criar movimentação',
    };
  }
}

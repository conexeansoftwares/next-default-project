'use server';

import { Action } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createContributorMovementSchema = z.object({
  contributorId: z.string().cuid(),
  action: z.enum(['E', 'S']),
});

export async function createContributorMovementAction(contributorId: string, action: string) {
  try {
    const validatedData = createContributorMovementSchema.parse({ contributorId , action});

    const movement = await prisma.contributorMovement.create({
      data: {
        contributorId: validatedData.contributorId,
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
    console.error('Error in createVehicleMovementAction:', error);

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

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

const getContributorMovementSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inicial inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data final inválida',
  }),
});

export async function getContributorMovementByDateAction(
  startDate: string,
  endDate: string,
) {
  try {

    const validatedData = getContributorMovementSchema.parse({
      startDate,
      endDate,
    });

    const startDateTime = new Date(validatedData.startDate);
    const endDateTime = new Date(validatedData.endDate);

    endDateTime.setHours(23, 59, 59, 999);

    const movements = await prisma.contributorMovement.findMany({
      where: {
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
      },
      select: {
        action: true,
        createdAt: true,
        contributor: {
          select: {
            name: true,
            lastName: true,
            registration: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const formattedMovements = movements.map((movement) => ({
      name: movement.contributor.name,
      lastName: movement.contributor.lastName,
      registration: movement.contributor.registration,
      action: movement.action,
      date: movement.createdAt.toISOString(),
    }));

    revalidatePath('/historical');

    return {
      success: true,
      message: 'Movimentações listadas com sucesso',
      data: formattedMovements,
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
      message: 'Ocorreu um erro ao listar movimentações',
    };
  }
}

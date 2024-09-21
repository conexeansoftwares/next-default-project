'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

const getVisitorMovementSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inicial inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data final inválida',
  }),
});

export async function getVisitorMovementByDateAction(
  startDate: string,
  endDate: string,
) {
  try {

    const validatedData = getVisitorMovementSchema.parse({
      startDate,
      endDate,
    });

    const startDateTime = new Date(validatedData.startDate);
    const endDateTime = new Date(validatedData.endDate);

    endDateTime.setHours(23, 59, 59, 999);

    const movements = await prisma.visitorMovement.findMany({
      where: {
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
      },
      select: {
        fullName: true,
        cpf: true,
        telephone: true,
        licensePlate: true,
        action: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const formattedMovements = movements.map((movement) => ({
      fullName: movement.fullName,
      cpf: movement.cpf,
      telephone: movement.telephone,
      licensePlate: movement.licensePlate,
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

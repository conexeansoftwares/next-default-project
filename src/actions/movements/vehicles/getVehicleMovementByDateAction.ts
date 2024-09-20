'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

const getVehicleMovementSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
});

export async function getVehicleMovementByDateAction(
  startDate: string,
  endDate: string,
) {
  try {
    console.log('Received dates:', { startDate, endDate });

    const validatedData = getVehicleMovementSchema.parse({
      startDate,
      endDate,
    });

    console.log('Validated dates:', validatedData);

    const startDateTime = new Date(validatedData.startDate);
    const endDateTime = new Date(validatedData.endDate);

    console.log('Parsed date objects:', { startDateTime, endDateTime });

    // Adjust the end date to include the entire day
    endDateTime.setHours(23, 59, 59, 999);

    const movements = await prisma.vehicleMovement.findMany({
      where: {
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
      },
      select: {
        action: true,
        createdAt: true,
        vehicle: {
          select: {
            licensePlate: true,
            carModel: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log('Query result:', movements);

    const formattedMovements = movements.map((movement) => ({
      licensePlate: movement.vehicle.licensePlate,
      carModel: movement.vehicle.carModel,
      companyName: movement.vehicle.company.name,
      action: movement.action,
      date: movement.createdAt.toISOString(),
    }));

    console.log('Formatted movements:', formattedMovements);

    revalidatePath('/historical');

    return {
      success: true,
      message: 'Movimentações listadas com sucesso',
      data: formattedMovements,
    };
  } catch (error) {
    console.error('Error in getVehicleMovementByDateAction:', error);

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

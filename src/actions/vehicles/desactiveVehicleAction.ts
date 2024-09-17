'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const deactivateVehicleSchema = z.string().cuid();

export async function desactivateVehicleAction(vehicleId: string) {
  try {
    const validatedId = deactivateVehicleSchema.parse(vehicleId);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: validatedId },
    });

    if (!vehicle) {
      return { success: false, message: 'Veículo não encontrado' };
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id: validatedId },
        data: {
          active: false,
          deactivatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Veículo desativado com sucesso',
      };
    });

    revalidatePath('/vehicles');

    return result;
  } catch (error) {
    console.log(error);
    console.error('Erro ao desativar veículo:', error);
    if (error instanceof z.ZodError) {
      return { success: false, message: 'ID do veículo inválido' };
    }
    return {
      success: false,
      message: 'Ocorreu um erro ao desativar o veículo',
    };
  }
}

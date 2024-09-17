'use server';

import {
  IVehicleReturnProps,
  IVehicleToEdit,
} from '@/app/(main)/vehicles/types';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const getVehicleSchema = z.string().cuid();

export async function getActiveVechileByIdAction(
  vehicleId: string,
): Promise<IVehicleReturnProps> {
  try {
    const validatedId = getVehicleSchema.parse(vehicleId);

    const vehicle: IVehicleToEdit | null = await prisma.vehicle.findUnique({
      select: {
        id: true,
        licensePlate: true,
        carModel: true,
        year: true,
        companyId: true,
      },
      where: {
        id: validatedId,
        active: true,
      },
    });

    if (!vehicle) {
      return {
        success: false,
        data: null,
        message: 'Veículo não encontrado ou inativo',
      };
    }

    return { success: true, data: vehicle };
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    return {
      success: false,
      data: null,
      message: 'Ocorreu um erro ao buscar o veículo',
    };
  }
}

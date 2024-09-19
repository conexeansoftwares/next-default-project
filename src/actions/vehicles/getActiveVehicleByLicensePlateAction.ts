'use server';

import {
  IVehicleReturnProps,
  IVehicleToEdit,
} from '../../app/(main)/vehicles/types';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const getVehicleSchema = z
  .string()
  .length(7, { message: 'Placa deve conter 7 caracteres' });

export async function getActiveVechileByLicensePlateAction(
  licensePlate: string,
): Promise<IVehicleReturnProps> {
  try {
    const validatedLisencePlate = getVehicleSchema.parse(licensePlate);

    const vehicle: IVehicleToEdit | null = await prisma.vehicle.findUnique({
      select: {
        id: true,
        licensePlate: true,
        carModel: true,
        owner: true,
        companyId: true,
      },
      where: {
        licensePlate: validatedLisencePlate,
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
    console.log(error);
    console.error('Erro ao buscar veículo:', error);
    return {
      success: false,
      data: null,
      message: 'Ocorreu um erro ao buscar o veículo',
    };
  }
}

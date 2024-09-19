'use server';

import {
  IVehicleReturnMovementProps,
  IVehicleToMovement,
} from '../../app/(main)/vehicles/types';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const getVehicleSchema = z
  .string()
  .length(7, { message: 'Placa deve conter 7 caracteres' });

export async function getActiveVechileByLicensePlateAction(
  licensePlate: string,
): Promise<IVehicleReturnMovementProps> {
  try {
    const validatedLisencePlate = getVehicleSchema.parse(licensePlate);

    const vehicleData = await prisma.vehicle.findUnique({
      select: {
        id: true,
        licensePlate: true,
        carModel: true,
        owner: true,
        companyId: true,
        company: {
          select: {
            name: true,
          },
        },
      },
      where: {
        licensePlate: validatedLisencePlate,
        active: true,
      },
    });

    if (!vehicleData) {
      return {
        success: false,
        data: null,
        message: 'Veículo não encontrado ou inativo',
      };
    }

    const vehicles: IVehicleToMovement = {
      id: vehicleData.id,
      licensePlate: vehicleData.licensePlate,
      owner: vehicleData.owner,
      carModel: vehicleData.carModel,
      companyId: vehicleData.companyId,
      companyName: vehicleData.company.name,
    };

    return { success: true, data: vehicles };
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

'use server';

import { IVehicle, IVehiclesReturnProps } from '../../app/(main)/vehicles/types';
import { prisma } from '../../lib/prisma';

export async function getAllActiveVehicles(): Promise<IVehiclesReturnProps> {
  try {
    const vehiclesData = await prisma.vehicle.findMany({
      select: {
        id: true,
        licensePlate: true,
        owner: true,
        carModel: true,
        companyId: true,
        company: {
          select: {
            name: true,
          },
        },
      },
      where: { active: true },
    });

    const vehicles: IVehicle[] = vehiclesData.map((vehicle) => ({
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      owner: vehicle.owner,
      carModel: vehicle.carModel,
      companyId: vehicle.companyId,
      companyName: vehicle.company.name,
    }));

    return { success: true, data: vehicles };
  } catch (error) {
    console.log(error);
    console.error('Erro ao listar veículos:', error);
    return {
      success: false,
      data: [],
      message: 'Ocorreu um erro ao listar os veículos',
    };
  }
}

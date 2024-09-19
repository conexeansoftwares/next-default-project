'use server';

import { prisma } from '../../lib/prisma';
import { VehicleFormData, vehicleFormSchema } from '../../schemas/vehicleSchema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function createVehicleAction(data: VehicleFormData) {
  try {
    const validatedData = vehicleFormSchema.parse(data);

    const { licensePlate, carModel, owner, companyId } = validatedData;

    await prisma.vehicle.create({
      data: {
        licensePlate,
        carModel,
        owner,
        companyId,
      },
    });

    revalidatePath('/vehicles');

    return { success: true, message: 'Veículo criado com sucesso' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, message: 'Ocorreu um erro ao criar o veículo' };
  }
}

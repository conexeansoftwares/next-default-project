'use server';

import { prisma } from '../../lib/prisma';
import { VehicleFormData, vehicleFormSchema } from '../../schemas/vehicleSchema';
import { revalidatePath } from 'next/cache';

export async function editVehicleAction(
  vehicleId: string,
  data: VehicleFormData,
) {
  try {
    const validatedData = vehicleFormSchema.parse(data);

    const { licensePlate, carModel, owner, companyId } = validatedData;

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        licensePlate,
        carModel,
        owner,
        companyId,
      },
    });

    revalidatePath('/vehicles');

    return { success: true, message: 'Empresa atualizada com sucesso' };
  } catch (error) {
    return {
      success: false,
      message: 'Ocorreu um erro ao atualizar a empresa',
    };
  }
}

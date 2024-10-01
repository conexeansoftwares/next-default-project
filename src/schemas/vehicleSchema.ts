import * as z from 'zod';
import { idSchema } from './idSchema';

export const vehicleFormSchema = z.object({
  licensePlate: z
    .string()
    .length(7, { message: 'Placa deve conter 7 caracteres' }),
  owner: z.string().max(50, 'Dono não pode exceder 50 caracteres'),
  carModel: z
    .string()
    .min(3, { message: 'Modelo deve conter pelo menos 3 caracteres' })
    .max(100, { message: 'Modelo não pode exceder 100 caracteres' }),
  companyId: idSchema,
});

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;

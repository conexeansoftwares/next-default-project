import * as z from 'zod';

export const vehicleFormSchema = z.object({
  licensePlate: z
    .string()
    .length(7, { message: 'Placa deve conter 7 caracteres' }),
  owner: z.string().max(50, 'Dono não pode exceder 50 caracteres'),
  carModel: z
    .string()
    .min(3, { message: 'Modelo deve conter pelo menos 3 caracteres' })
    .max(100, { message: 'Modelo não pode exceder 100 caracteres' }),
  companyId: z.string().cuid({ message: 'Empresa inválida' }),
});

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;

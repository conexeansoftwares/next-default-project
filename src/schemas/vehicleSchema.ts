import * as z from 'zod';

const currentYear = new Date().getFullYear();
const oldestAllowedYear = 1900;

export const vehicleFormSchema = z.object({
  licensePlate: z
    .string()
    .length(7, { message: 'Placa deve conter 7 caracteres' }),
  year: z
    .string()
    .length(4, { message: 'Ano deve conter 4 caracteres' })
    .refine(
      (year) => {
        const numYear = parseInt(year, 10);
        return !isNaN(numYear) && numYear >= oldestAllowedYear && numYear <= currentYear + 1;
      },
      {
        message: `Ano deve ser um número válido entre ${oldestAllowedYear} e ${currentYear + 1}`,
      }
    ),
  carModel: z
    .string()
    .min(3, { message: 'Modelo deve conter pelo menos 3 caracteres' })
    .max(100, { message: 'Modelo não pode exceder 100 caracteres' }),
  companyId: z.string().cuid({ message: 'Empresa inválida' }),
});

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;

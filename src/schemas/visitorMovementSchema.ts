import { removeCpfMask } from '@/utils/cpfUtils';
import * as z from 'zod';

function validateCPF(cpf: string): boolean {
  cpf = removeCpfMask(cpf);

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

const actionEnum = z.enum(['E', 'S']);

export const visitorMovementFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Nome deve conter pelo menos 2 caracteres' })
    .max(100, { message: 'Nome não pode exceder 100 caracteres' }),
  cpf: z
    .string()
    .optional()
    .refine(
      (cpf) => {
        if (!cpf) return true; // Permite campo vazio
        return (
          /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf) &&
          validateCPF(removeCpfMask(cpf))
        );
      },
      {
        message: 'CPF inválido ou formato incorreto (000.000.000-00)',
      },
    ),
  telephone: z.string().refine(
    (value) => {
      if (value.trim() === '') return true;
      
      const digitsOnly = value.replace(/\D/g, '');
      
      return digitsOnly.length === 11;
    },
    {
      message: 'Quando preenchido, o telefone deve conter 11 dígitos numéricos',
    }
  ),
  licensePlate: z
    .string()
    .refine((value) => value === '' || value.length === 7, {
      message: 'Placa deve conter 7 dígitos',
    })
    .optional(),
  companyIds: z
    .array(z.string().cuid({ message: 'Empresa inválida' }))
    .min(1, { message: 'É necessário informar pelo menos 1 empresa' }),
  action: actionEnum,
});

export type VisitorMovementFormData = z.infer<typeof visitorMovementFormSchema>;

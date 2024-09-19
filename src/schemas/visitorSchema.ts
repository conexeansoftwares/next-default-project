import { z } from 'zod';

export const visitanteFormSchema = z.object({
  fullName: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().length(11, 'Nome é obrigatório').optional(),
  telephone: z.string().min(1, 'Nome é obrigatório'),
  licensePlate: z.string().min(1, 'Nome é obrigatório'),
  companyIds: z.array(z.string().cuid({ message: 'Empresa inválida' })).min(1, { message: 'É necessário informar pelo menos 1 empresa' }),
  acao: z.enum(['entrada', 'saida']),
});

export type VisitanteFormData = z.infer<typeof visitanteFormSchema>;

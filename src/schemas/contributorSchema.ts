import * as z from 'zod';

export const contributorFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nome deve conter pelo menos 2 caracteres' })
    .max(20, { message: 'Nome não pode exceder 20 caracteres' }),
  lastName: z
    .string()
    .max(20, { message: 'Sobrenome não pode exceder 20 caracteres' }),
  registration: z
    .string()
    .min(2, { message: 'Matrícula deve conter pelo menos 2 caracteres' })
    .max(20, { message: 'Matrícula não pode exceder 20 caracteres' }),
  internalPassword: z
    .string()
    .max(20, { message: 'Senha interna não pode exceder 20 caracteres' })
    .optional(),
  telephone: z
    .string()
    .max(15, { message: 'Telefone deve conter 11 caracteres' })
    .optional(),
  observation: z
    .string()
    .max(200, { message: 'Observação não pode exceder 200 caracteres' })
    .optional(),
  photoURL: z
    .string()
    .max(200, { message: 'URL da imagem não pode exceder 200 caracteres' })
    .optional(),
  companyIds: z.array(z.string().cuid({ message: 'Empresa inválida' })).min(1, { message: 'É necessário informar pelo menos 1 empresa' }),
});

export type ContributorFormData = z.infer<typeof contributorFormSchema>;

/* eslint-disable no-useless-escape */
import * as z from 'zod';

export const userFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Email inválido' })
      .max(100, { message: 'Email não pode exceder 100 caracteres' }),
    contributorId: z.string().cuid({ message: 'Colaborador inválido' }),
    permissions: z.record(z.record(z.boolean())),
    password: z
      .string()
      .min(8, { message: 'Senha deve conter pelo menos 8 caracteres' })
      .max(100, { message: 'Senha não pode exceder 100 caracteres' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/,
        {
          message: 'Senha não atende aos critérios de segurança',
        },
      ),
    confirmPassword: z
      .string()
      .min(8, {
        message: 'Confirmação de senha deve conter pelo menos 8 caracteres',
      })
      .max(100, {
        message: 'Confirmação de senha não pode exceder 100 caracteres',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

export type UserFormData = z.infer<typeof userFormSchema>;

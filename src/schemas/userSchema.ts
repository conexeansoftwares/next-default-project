import * as z from 'zod';
import { idSchema } from './idSchema';

// Base schema for user details without password
const baseUserFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .max(100, { message: 'Email não pode exceder 100 caracteres' }),
  employeeId: idSchema,
  permissions: z.record(z.record(z.boolean())),
});

// Password schema
const passwordSchemaObject = z.object({
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
});

export const passwordSchema = passwordSchemaObject.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  }
);

// Combined schema
export const combinedUserFormSchema = baseUserFormSchema.merge(passwordSchemaObject).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  }
);

export type CombinedUserForm = z.infer<typeof combinedUserFormSchema>;

export const userFormSchemaWithoutPassword = baseUserFormSchema;

export type UserFormWithoutPassword = z.infer<typeof userFormSchemaWithoutPassword>;

export type PasswordFormSchema = z.infer<typeof passwordSchema>;

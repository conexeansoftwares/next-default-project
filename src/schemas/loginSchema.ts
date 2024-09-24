import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(8, { message: 'A senha deve conter pelo menos 8 caracteres' }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

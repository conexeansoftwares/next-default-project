'use client';

import React from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../components/ui/form';

const loginFormSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormData) => Promise<void>;
  submitButtonText: string;
}

export const LoginForm = forwardRef<{ reset: () => void }, LoginFormProps>(
  function LoginForm({ onSubmit, submitButtonText }, ref) {
    const form = useForm<LoginFormData>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    });

    useImperativeHandle(ref, () => ({
      reset: () => form.reset(),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">E-mail</Label>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Senha</Label>
                <FormControl>
                  <Input id="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {submitButtonText}
          </Button>
        </form>
      </Form>
    );
  }
);

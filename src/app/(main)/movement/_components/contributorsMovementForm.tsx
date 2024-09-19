'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { registrarMovimentacaoColaborador } from '@/app/actions/registrarMovimentacaoColaborador';

const colaboradorFormSchema = z.object({
  id: z.string().min(1, 'ID do colaborador é obrigatório'),
  acao: z.enum(['entrada', 'saida']),
});

type ColaboradorFormData = z.infer<typeof colaboradorFormSchema>;

export function ContributorMovementForm() {
  const form = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorFormSchema),
    defaultValues: {
      id: '',
      acao: 'entrada',
    },
  });

  const onSubmit = async (data: ColaboradorFormData) => {
    try {
      // await registrarMovimentacaoColaborador(data);
      form.reset();
      // Adicione lógica para feedback de sucesso
    } catch (error) {
      // Adicione lógica para tratamento de erro
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Colaborador</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Informe o ID do colaborador" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ação</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={field.value === 'entrada' ? 'success' : 'outline'}
                    onClick={() => field.onChange('entrada')}
                  >
                    Entrada
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === 'saida' ? 'destructive' : 'outline'}
                    onClick={() => field.onChange('saida')}
                  >
                    Saída
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Registrar Movimentação</Button>
        </div>
      </form>
    </Form>
  );
}

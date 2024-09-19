'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  VisitanteFormData,
  visitanteFormSchema,
} from '@/schemas/visitorSchema';
import { getAllActiveCompaniesToSelect } from '@/actions/companies/getAllActiveCompaniesToSelect';
import {
  ICompaniesReturnToSelectProps,
  ICompanyToSelect,
} from '../../companies/types';
import { useToast } from '../../../../hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
// import { registrarMovimentacaoVisitante } from '@/app/actions/registrarMovimentacaoVisitante';

export function VisitorsMovementForm() {
  const [companies, setCompanies] = useState<ICompanyToSelect[]>([]);
  const [selectKey, setSelectKey] = useState(0);
  const { toast } = useToast();

  const form = useForm<VisitanteFormData>({
    resolver: zodResolver(visitanteFormSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      telephone: '',
      licensePlate: '',
      companyIds: [],
      acao: 'entrada',
    },
  });

  const onSubmit = async (data: VisitanteFormData) => {
    try {
      // await registrarMovimentacaoVisitante(data);
      form.reset();
      // Adicione lógica para feedback de sucesso
    } catch (error) {
      // Adicione lógica para tratamento de erro
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const result: ICompaniesReturnToSelectProps =
        await getAllActiveCompaniesToSelect();
      if (result.success) {
        setCompanies(result.data);
      } else {
        console.log(result);
        toast({
          variant: 'destructive',
          title: 'Ah não. Algo deu errado.',
          description: 'Não foi possível listar as empresas.',
        });
      }
    };

    fetchCompanies();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2 lg:col-span-1">
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Informe o nome completo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Informe o CPF" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Informe o telefone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa do veículo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Informe a placa do veículo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acao"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Ação</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={field.value === 'entrada' ? 'success' : 'outline'}
                    onClick={() => field.onChange('entrada')}
                  >
                    Entrada
                  </Button>
                  <Button
                    type="button"
                    variant={
                      field.value === 'saida' ? 'destructive' : 'outline'
                    }
                    onClick={() => field.onChange('saida')}
                  >
                    Saída
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyIds"
            render={() => (
              <FormItem className="col-span-full">
                <div className="mb-4 mt-6">
                  <FormLabel className="text-base">Empresas</FormLabel>
                  <FormDescription>
                    Selecione as empresas para as quais o visitante irá
                  </FormDescription>
                </div>
                <ScrollArea className="h-[220px] w-full rounded-md border p-4">
                  {companies.map((company) => (
                    <FormField
                      key={`${company.id}-${selectKey}`}
                      control={form.control}
                      name="companyIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={company.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(company.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        company.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== company.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {company.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </ScrollArea>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="col-span-full" type="submit">
            Registrar Movimentação
          </Button>
        </div>
      </form>
    </Form>
  );
}

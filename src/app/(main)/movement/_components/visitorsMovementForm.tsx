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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  ICompaniesReturnToSelectProps,
  ICompanyToSelect,
} from '../../companies/types';
import { getAllActiveCompaniesToSelect } from '@/actions/companies/getAllActiveCompaniesToSelect';
import { createVisitorMovementAction } from '@/actions/movements/visitors/createVisitorMovementAction';
import {
  VisitorMovementFormData,
  visitorMovementFormSchema,
} from '@/schemas/visitorMovementSchema';
import { Skeleton } from '@/components/ui/skeleton';

export function VisitorsMovementForm() {
  const [companies, setCompanies] = useState<ICompanyToSelect[]>([]);
  const [action, setAction] = useState<'E' | 'S'>('E');
  const [requesting, setRequesting] = useState<boolean>(false);
  const [requestingCompanies, setRequestingCompanies] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<VisitorMovementFormData>({
    resolver: zodResolver(visitorMovementFormSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      telephone: '',
      licensePlate: '',
      companyIds: [],
      action: 'E',
    },
  });

  const onSubmit = async (data: VisitorMovementFormData) => {
    try {
      setRequesting(true);
      const response = await createVisitorMovementAction(data);

      if (response.success) {
        toast({
          variant: 'success',
          title: 'Movimentação registrada com sucesso',
          description: `${
            action === 'E' ? 'Entrada' : 'Saída'
          } registrada para o visitante ${response.data?.fullName}`,
        });
        form.reset();
        setAction('E');
      } else {
        toast({
          variant: 'destructive',
          title: 'Ah não. Algo deu errado.',
          description: 'Não foi possível cadastrar colaborador.',
        });
      }
      setRequesting(false);
    } catch (error) {
      setRequesting(false);
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar movimentação',
        description: 'Ocorreu um erro ao processar sua solicitação.',
      });
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      setRequestingCompanies(true);
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
      setRequestingCompanies(false);
    };

    fetchCompanies();
  }, [toast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="col-span-full">
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
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    mask="###.###.###-##"
                    placeholder="Informe o CPF"
                  />
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
                  <Input
                    {...field}
                    mask="(##) #####-####"
                    placeholder="Informe o telefone"
                  />
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
                  <Input
                    {...field}
                    uppercase
                    alphanumeric
                    maxLength={7}
                    placeholder="Informe a placa do veículo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyIds"
            render={() => (
              <FormItem className="col-span-full">
                <div className="mb-4">
                  <FormLabel className="text-base">Empresas</FormLabel>
                  <FormDescription>
                    Selecione as empresas para as quais o visitante irá
                  </FormDescription>
                </div>
                <ScrollArea className="h-[220px] w-full rounded-md border p-4">
                  {requestingCompanies ? (
                    <div className="w-full grid gap-3">
                      <Skeleton className="w-full h-[20px] rounded-full" />
                      <Skeleton className="w-full h-[20px] rounded-full" />
                      <Skeleton className="w-full h-[20px] rounded-full" />
                      <Skeleton className="w-full h-[20px] rounded-full" />
                      <Skeleton className="w-full h-[20px] rounded-full" />
                      <Skeleton className="w-full h-[20px] rounded-full" />
                    </div>
                  ) : (
                    companies.map((company) => (
                      <FormField
                        key={company.id}
                        control={form.control}
                        name="companyIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={company.id}
                              className="flex flex-row items-start space-x-3 space-y-0 mb-3"
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
                    ))
                  )}
                </ScrollArea>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={action === 'E' ? 'default' : 'secondary'}
              onClick={() => {
                setAction('E'), form.setValue('action', 'E');
              }}
              className={
                action === 'E'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : ''
              }
            >
              Entrada
            </Button>
            <Button
              type="button"
              variant={action === 'S' ? 'default' : 'outline'}
              onClick={() => {
                setAction('S'), form.setValue('action', 'S');
              }}
              className={
                action === 'S' ? 'bg-red-500 hover:bg-red-600 text-white' : ''
              }
            >
              Saída
            </Button>
          </div>

          <Button disabled={requesting} className="col-span-full">
            Registrar movimentação
          </Button>

          <Button
            onClick={() => {
              form.reset();
              setAction('E');
            }}
            variant="warning"
            className="col-span-full"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}

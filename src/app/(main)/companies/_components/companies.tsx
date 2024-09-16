'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '@/components/ui/page';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/dataTable';
import { useToast } from '@/hooks/use-toast';
import { deactivateCompanyAction } from '@/actions/companies/desactiveCompanyAction';
import { ICompaniesReturnProps, ICompany } from '../types';
import { getColumns } from '../columns';

export function Companies({ success, data, message }: ICompaniesReturnProps) {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<ICompany[]>(data ?? []);

  if (!success) {
    toast({
      variant: 'destructive',
      title: 'Ah não. Algo deu errado.',
      description: message,
    });
  }

  const handleDelete = useCallback(async (companyId: string) => {
    try {
      const result = await deactivateCompanyAction(companyId);
      if (result.success) {
        toast({
          variant: 'success',
          description: 'Empresa desativada com sucesso!',
        });
        setCompanies(prevCompanies => prevCompanies.filter(company => company.id !== companyId));
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: result.message || 'Não foi possível desativar a empresa.',
        });
      }
    } catch (error) {
      console.error('Erro ao desativar empresa:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao desativar a empresa.',
      });
    }
  }, [toast]);

  const columns = getColumns({ onDelete: handleDelete });

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Empresas" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <div className="flex w-full justify-end">
          <Link href={'/companies/create'}>
            <Button className="mb-2">
              <CirclePlus className="w-4 h-4 me-2" />
              Cadastar empresa
            </Button>
          </Link>
        </div>
        <DataTable.Root columns={columns} data={companies}>
          <DataTable.Tools
            searchKey="name"
            searchPlaceholder="Filtrar por nome..."
          />
          <DataTable.Content columns={columns} />
          <DataTable.Pagination />
        </DataTable.Root>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

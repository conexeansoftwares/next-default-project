'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '../../../../components/ui/page';
import { Button } from '../../../../components/ui/button';
import { DataTable } from '../../../../components/ui/dataTable';
import { useToast } from '../../../../hooks/use-toast';
import { getColumns } from '../columns';
import { IContributor, IContributorsReturnProps } from '../types';
import { desactivateContributortion } from '@/actions/contributors/desactiveContributorAction';

export function Contributors({ success, data, message }: IContributorsReturnProps) {
  const { toast } = useToast();
  const [contributors, setContributors] = useState<IContributor[]>(data ?? []);

  if (!success) {
    toast({
      variant: 'destructive',
      title: 'Ah não. Algo deu errado.',
      description: message,
    });
  }

  const handleDelete = useCallback(async (contributorId: string) => {
    try {
      const result = await desactivateContributortion(contributorId);
      if (result.success) {
        toast({
          variant: 'success',
          description: 'Colaborador desativado com sucesso!',
        });
        setContributors(prevContributors => prevContributors.filter(contributor => contributor.id !== contributorId));
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: result.message || 'Não foi possível desativar o colaborador.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao desativar o colaborador.',
      });
    }
  }, [toast]);

  const columns = getColumns({ onDelete: handleDelete });

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Colaboradores" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <div className="flex w-full justify-end">
          <Link href={'/contributors/create'}>
            <Button className="mb-2">
              <CirclePlus className="w-4 h-4 me-2" />
              Cadastar colaborador
            </Button>
          </Link>
        </div>
        <DataTable.Root columns={columns} data={contributors}>
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

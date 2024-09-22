'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '../../../../components/ui/page';
import { Button } from '../../../../components/ui/button';
import { DataTable } from '../../../../components/ui/dataTable';
import { useToast } from '../../../../hooks/use-toast';
import { IUserReturnProps, IContributorToSelect } from '../types';
import { desactivateUserAction } from '@/actions/users/desactiveUserAction';
import { getColumns } from '../columns';
import { Permission } from '@prisma/client';

interface IUser {
  id: string;
  email: string;
  contributorId: string;
  userPermissions: {
    module: string;
    permission: Permission;
  }[];
}

export function Users({ success, data, message }: IUserReturnProps) {
  const { toast } = useToast();
  const [contributors, setContributors] = useState<IUser[]>(data ?? []);

  if (!success) {
    toast({
      variant: 'destructive',
      title: 'Ah não. Algo deu errado.',
      description: message,
    });
  }

  const handleDelete = useCallback(
    async (userId: string) => {
      try {
        const result = await desactivateUserAction(userId);
        if (result.success) {
          toast({
            variant: 'success',
            description: 'Colaborador desativado com sucesso!',
          });
          setContributors((prevContributors) =>
            prevContributors.filter(
              (contributor) => contributor.id !== userId,
            ),
          );
        } else {
          toast({
            variant: 'destructive',
            title: 'Erro',
            description:
              result.message || 'Não foi possível desativar o colaborador.',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Ocorreu um erro inesperado ao desativar o colaborador.',
        });
      }
    },
    [toast],
  );

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
          <Link href={'/users/create'}>
            <Button className="mb-2">
              <CirclePlus className="w-4 h-4 me-2" />
              Cadastar colaborador
            </Button>
          </Link>
        </div>
        <DataTable.Root columns={columns} data={contributors}>
          <DataTable.Tools
            searchKey="email"
            searchPlaceholder="Filtrar por e-mail..."
          />
          <DataTable.Content columns={columns} />
          <DataTable.Pagination />
        </DataTable.Root>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

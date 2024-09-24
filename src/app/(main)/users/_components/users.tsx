'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '../../../../components/ui/page';
import { Button } from '../../../../components/ui/button';
import { DataTable } from '../../../../components/ui/dataTable';
import { useToast } from '../../../../hooks/useToast';
import { getColumns } from '../columns';
import { IUser } from '../types';
import { MESSAGE } from '@/utils/message';
import { deactivateUserAction } from '@/actions/users/desactiveUserAction';
import { useAuth } from '@/hooks/usePermissions';
import { IGetAllActiveUsersReturnProps } from '@/actions/users/getAllActivesUsersAction';

interface UsersProps {
  result: IGetAllActiveUsersReturnProps;
}

export function Users({ result }: UsersProps) {
  const { toast } = useToast();
  const { checkPermission } = useAuth();

  const canEditAndCreate = checkPermission('users', 'WRITE');
  const canDelete = checkPermission('users', 'DELETE');

  const [users, setUsers] = useState<IUser[]>(
    result.success ? (result.data as IUser[]) : [],
  );

  useEffect(() => {
    if (!result.success) {
      toast({
        variant: 'warning',
        title: MESSAGE.COMMON.GENERIC_WARNING_TITLE,
        description: result.error,
      });
    }
  }, [result, toast]);

  const handleDelete = useCallback(
    async (userId: string) => {
      const deleteResult = await deactivateUserAction(userId);
      if (deleteResult.success) {
        toast({
          variant: 'success',
          description: deleteResult.message,
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        toast({
          variant: 'destructive',
          title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
          description: deleteResult.error,
        });
      }
    },
    [toast],
  );

  const columns = getColumns({
    onDelete: handleDelete,
    canEditAndCreate,
    canDelete,
  });

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Usuários" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        {canEditAndCreate && (
          <div className="flex w-full justify-end">
            <Link href={'/users/create'}>
              <Button className="mb-2">
                <CirclePlus className="w-4 h-4 me-2" />
                Cadastrar usuário
              </Button>
            </Link>
          </div>
        )}
        <DataTable.Root columns={columns} data={users}>
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

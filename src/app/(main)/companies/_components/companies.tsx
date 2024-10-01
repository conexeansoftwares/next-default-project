'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '../../../../components/ui/page';
import { Button } from '../../../../components/ui/button';
import { DataTable } from '../../../../components/ui/dataTable';
import { useToast } from '../../../../hooks/useToast';
import { ICompany } from '../types';
import { getColumns } from '../columns';
import {
  deactivateCompanyAction,
  IDeactiveCompanyReturnProps,
} from '@/actions/companies/deactivateCompanyAction';
import { useAuth } from '@/hooks/usePermissions';
import { IGetAllActiveCompaniesReturnProps } from '@/actions/companies/getAllActiveCompanies';
import { MESSAGE } from '@/utils/message';

interface ICompaniesProps {
  result: IGetAllActiveCompaniesReturnProps;
}

export function Companies({ result }: ICompaniesProps) {
  const { toast } = useToast();
  const { checkPermission } = useAuth();

  const canEditAndCreate = checkPermission('companies', 'WRITE');
  const canDelete = checkPermission('companies', 'DELETE');

  const [companies, setCompanies] = useState<ICompany[]>(
    result.success ? (result.data as ICompany[]) : [],
  );

  const handleDelete = useCallback(
    async (companyId: number) => {
      const response: IDeactiveCompanyReturnProps =
        await deactivateCompanyAction(companyId);

      if (response.success) {
        toast({
          variant: 'success',
          description: response.data,
        });
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.id !== companyId),
        );
      } else {
        toast({
          variant: 'destructive',
          title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
          description: response.error,
        });
      }
    },
    [toast],
  );

  const columns = getColumns({
    onDelete: handleDelete,
    canDelete,
    canEditAndCreate,
  });

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Empresas" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        {canEditAndCreate && (
          <div className="flex w-full justify-end">
            <Link href={'/companies/create'}>
              <Button className="mb-2">
                <CirclePlus className="w-4 h-4 me-2" />
                Cadastrar empresa
              </Button>
            </Link>
          </div>
        )}

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

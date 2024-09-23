'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '../../../../components/ui/page';
import { Button } from '../../../../components/ui/button';
import { DataTable } from '../../../../components/ui/dataTable';
import { useToast } from '../../../../hooks/use-toast';
import { GetAllActiveCompanyActionResult, ICompany } from '../types';
import { getColumns } from '../columns';
import { deactivateCompanyAction } from '@/actions/companies/deactivateCompanyAction';
import { MESSAGE } from '@/utils/message';

interface CompaniesProps {
  result: GetAllActiveCompanyActionResult;
}

export function Companies({ result }: CompaniesProps) {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<ICompany[]>(
    result.success ? (result.data as ICompany[]) : [],
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
    async (companyId: string) => {
      const deleteResult = await deactivateCompanyAction(companyId);
      if (deleteResult.success) {
        toast({
          variant: 'success',
          description: deleteResult.message,
        });
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.id !== companyId),
        );
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
              Cadastrar empresa
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

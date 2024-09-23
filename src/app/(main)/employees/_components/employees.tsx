'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '../../../../components/ui/page';
import { Button } from '../../../../components/ui/button';
import { DataTable } from '../../../../components/ui/dataTable';
import { useToast } from '../../../../hooks/use-toast';
import { getColumns } from '../columns';
import { GetAllActiveEmployeesActionResult, IEmployeeWithCompanies } from '../types';
import { deactivateEmployeeAction } from '@/actions/employees/deactiveEmployeeAction';
import { MESSAGE } from '@/utils/message';

interface EmployeesProps {
  result: GetAllActiveEmployeesActionResult;
}

export function Employees({ result }: EmployeesProps) {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<IEmployeeWithCompanies[]>(
    result.success ? (result.data as IEmployeeWithCompanies[]) : [],
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
    async (employeeId: string) => {
      const deleteResult = await deactivateEmployeeAction(employeeId);
      if (deleteResult.success) {
        toast({
          variant: 'success',
          description: deleteResult.message,
        });
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== employeeId),
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
          <PageComponent.Title text="Colaboradores" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <div className="flex w-full justify-end">
          <Link href={'/employees/create'}>
            <Button className="mb-2">
              <CirclePlus className="w-4 h-4 me-2" />
              Cadastrar colaborador
            </Button>
          </Link>
        </div>

        <DataTable.Root columns={columns} data={employees}>
          <DataTable.Tools
            searchKey="fullName"
            searchPlaceholder="Filtrar por nome..."
          />
          <DataTable.Content columns={columns} />
          <DataTable.Pagination />
        </DataTable.Root>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

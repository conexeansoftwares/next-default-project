'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '../../../../components/ui/page';
import { Button } from '../../../../components/ui/button';
import { DataTable } from '../../../../components/ui/dataTable';
import { useToast } from '../../../../hooks/useToast';
import { getColumns } from '../columns';
import { deactivateEmployeeAction, IDeactiveEmployeeReturnProps } from '@/actions/employees/deactiveEmployeeAction';
import { MESSAGE } from '@/utils/message';
import { useAuth } from '@/hooks/usePermissions';
import { IGetAllACtiveEmplyeesReturnProps } from '@/actions/employees/getAllActiveEmployee';
import { IEmployeeDataTable } from '../types';

interface EmployeesProps {
  result: IGetAllACtiveEmplyeesReturnProps;
}

export function Employees({ result }: EmployeesProps) {
  const { toast } = useToast();
  const { checkPermission } = useAuth();

  const canEditAndCreate = checkPermission('employees', 'WRITE');
  const canDelete = checkPermission('employees', 'DELETE');

  const [employees, setEmployees] = useState<IEmployeeDataTable[]>(
    result.success ? (result.data as IEmployeeDataTable[]) : [],
  );

  useEffect(() => {
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_WARNING_TITLE,
        description: result.error,
      });
    }
  }, [result, toast]);

  const handleDelete = useCallback(
    async (employeeId: number) => {
      const deleteResult: IDeactiveEmployeeReturnProps = await deactivateEmployeeAction(employeeId);
      if (deleteResult.success) {
        toast({
          variant: 'success',
          description: deleteResult.data,
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

  const columns = getColumns({
    onDelete: handleDelete,
    canEditAndCreate,
    canDelete,
  });

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Colaboradores" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        {canEditAndCreate && (
          <div className="flex w-full justify-end">
            <Link href={'/employees/create'}>
              <Button className="mb-2">
                <CirclePlus className="w-4 h-4 me-2" />
                Cadastrar colaborador
              </Button>
            </Link>
          </div>
        )}

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

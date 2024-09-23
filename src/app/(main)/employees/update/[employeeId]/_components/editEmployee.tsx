'use client';

import { EmployeeFormData } from '../../../../../../schemas/employeeSchema';
import { PageComponent } from '../../../../../../components/ui/page';
import { useToast } from '../../../../../../hooks/use-toast';
import { IEmployeeToEdit } from '../../../types';
import { editEmployeeAction } from '@/actions/employees/editEmployeeAction';
import { EmployeeForm } from '../../../_components/employeeForm';
import { MESSAGE } from '@/utils/message';

export default function EditEmployee(employee: IEmployeeToEdit) {
  const { toast } = useToast();

  const initialData: Partial<EmployeeFormData> = {
    fullName: employee.fullName,
    registration: employee.registration,
    companyIds: employee.companyIds,
    internalPassword: employee.internalPassword || undefined,
    telephone: employee.telephone || undefined,
    cellPhone: employee.cellPhone || undefined,
    observation: employee.observation || undefined,
    photoURL: employee.photoURL || undefined,
  };

  async function onSubmit(values: EmployeeFormData) {
    const response = await editEmployeeAction(employee.id, values);

    if (response.success) {
      toast({
        variant: 'success',
        description: response.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: response.error,
      });
    }
  }

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Editar colaborador" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <EmployeeForm
          initialData={initialData}
          onSubmit={onSubmit}
          submitButtonText="Atualizar colaborador"
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

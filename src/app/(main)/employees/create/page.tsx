'use client';

import { EmployeeFormData } from '../../../../schemas/employeeSchema';
import { PageComponent } from '../../../../components/ui/page';
import { useToast } from '../../../../hooks/useToast';
import { useRef } from 'react';
import { createEmployeeAction, ICreateEmployeeReturnProps } from '@/actions/employees/createEmployeeAction';
import { EmployeeForm } from '../_components/employeeForm';
import { MESSAGE } from '@/utils/message';

export default function CreateEmployeePage() {
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void } | null>(null);

  async function onSubmit(values: EmployeeFormData) {
    const response: ICreateEmployeeReturnProps = await createEmployeeAction(values);

    if (response.success) {
      toast({
        variant: 'success',
        description: response.data,
      });

      if (formRef.current) {
        formRef.current.reset();
      }
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
        <PageComponent.Title text="Cadastrar colaborador" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <EmployeeForm 
          ref={formRef}
          onSubmit={onSubmit} 
          submitButtonText="Cadastrar colaborador" 
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

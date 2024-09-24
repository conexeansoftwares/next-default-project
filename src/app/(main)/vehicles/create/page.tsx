'use client';

import { VehicleFormData } from '../../../../schemas/vehicleSchema';
import { PageComponent } from '../../../../components/ui/page';
import { useToast } from '../../../../hooks/useToast';
import { useRef } from 'react';
import { createVehicleAction, ICreateVehicleReturnProps } from '@/actions/vehicles/createVehicleAction';
import { VehicleForm } from '../_components/vehicleForm';
import { MESSAGE } from '@/utils/message';

export default function CreateVehiclePage() {
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void } | null>(null);

  async function onSubmit(values: VehicleFormData) {
    const response: ICreateVehicleReturnProps = await createVehicleAction(values);

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
        <PageComponent.Title text="Cadastrar veículo" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <VehicleForm 
          ref={formRef}
          onSubmit={onSubmit} 
          submitButtonText="Cadastrar veículo" 
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

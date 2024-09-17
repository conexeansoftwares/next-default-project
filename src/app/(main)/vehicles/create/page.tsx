'use client';

import { createVehicleAction } from '@/actions/vehicles/createVehicleAction';
import { PageComponent } from '@/components/ui/page';
import { useToast } from '@/hooks/use-toast';
import { VehicleFormData } from '@/schemas/vehicleSchema';
import { useRef } from 'react';
import { VehicleForm } from '../_components/vehicleForm';

export default function CreateVehiclePage() {
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void } | null>(null);

  async function onSubmit(values: VehicleFormData) {
    const response = await createVehicleAction(values);

    if (response.success) {
      toast({
        variant: 'success',
        description: 'Veículo cadastrado com sucesso!',
      });

      if (formRef.current) {
        formRef.current.reset();
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Ah não. Algo deu errado.',
        description: 'Não foi possível cadastrar veículo.',
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

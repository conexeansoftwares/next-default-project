'use client';

import { useToast } from '../../../../../../hooks/use-toast';
import { IVehicleToEdit } from '../../../types';
import { VehicleFormData } from '../../../../../../schemas/vehicleSchema';
import { PageComponent } from '../../../../../../components/ui/page';
import { VehicleForm } from '../../../_components/vehicleForm';
import { editVehicleAction } from '../../../../../../actions/vehicles/editVehicleAction';

export default function EditVehicle(vehicle: IVehicleToEdit) {
  const { toast } = useToast();

  async function onSubmit(values: VehicleFormData) {
    const response = await editVehicleAction(vehicle.id, values);

    if (response.success) {
      toast({
        variant: 'success',
        description: 'Veículo editado com sucesso!',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ah não. Algo deu errado.',
        description: 'Não foi possível editar veículo.',
      });
    }
  }

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Editar veículo" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <VehicleForm
          initialData={vehicle}
          onSubmit={onSubmit}
          submitButtonText="Atualizar veículo"
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

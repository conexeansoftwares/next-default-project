'use client';

import { VehicleFormData } from '../../../../../../schemas/vehicleSchema';
import { PageComponent } from '../../../../../../components/ui/page';
import { useToast } from '../../../../../../hooks/use-toast';
import { editVehicleAction } from '@/actions/vehicles/editVehicleAction';
import { VehicleForm } from '../../../_components/vehicleForm';
import { MESSAGE } from '@/utils/message';
import { IVehicle } from '../../../types';

export default function EditVehicle(vehicle: IVehicle) {
  const { toast } = useToast();

  const initialData: Partial<VehicleFormData> = {
    licensePlate: vehicle.licensePlate,
    carModel: vehicle.carModel,
    owner: vehicle.owner || undefined,
    companyId: vehicle.companyId,
  };

  async function onSubmit(values: VehicleFormData) {
    const response = await editVehicleAction(vehicle.id, values);

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
        <PageComponent.Title text="Editar veículo" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <VehicleForm
          initialData={initialData}
          onSubmit={onSubmit}
          submitButtonText="Atualizar veículo"
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

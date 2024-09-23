import { getActiveVehicleByIdAction } from '@/actions/vehicles/getActiveVehicleByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditVehicle from './_components/editVehicle';

export default async function Page({
  params,
}: {
  params: { vehicleId: string };
}) {
  const response = await getActiveVehicleByIdAction(params.vehicleId);

  if (response.success) {
    return <EditVehicle {...response.data} />;
  }

  return (
    <EntityNotFound 
      title='Veículo não encontrado ou inativo.' 
      href='/vehicles' 
    />
  );
}

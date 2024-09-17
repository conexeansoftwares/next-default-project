import { getActiveVechileByIdAction } from '../../../../../actions/vehicles/getActiveVehicleByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditVehicle from './_components/editVehicle';

export default async function Page({
  params,
}: {
  params: { vehicleId: string };
}) {
  const response = await getActiveVechileByIdAction(params.vehicleId);

  if (response.success && response.data) {
    return <EditVehicle {...response.data} />;
  }

  return (
    <EntityNotFound title='Veículo não encontrado ou inativo.' href='/vehicles' />
  );
}

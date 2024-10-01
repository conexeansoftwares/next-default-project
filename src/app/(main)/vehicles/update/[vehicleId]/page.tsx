import { getActiveVehicleByIdAction, IGetActiveVehicleByIdReturnProps } from '@/actions/vehicles/getActiveVehicleByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditVehicle from './_components/editVehicle';
import { MESSAGE } from '@/utils/message';

export default async function Page({
  params,
}: {
  params: { vehicleId: string };
}) {
  const vehicleId = parseInt(params.vehicleId, 10);

  const response: IGetActiveVehicleByIdReturnProps = await getActiveVehicleByIdAction(vehicleId);

  if (response.success && response.data) {
    return <EditVehicle vehicle={response.data} />;
  }

  return (
    <EntityNotFound 
      title={response.error || MESSAGE.VEHICLE.NOT_FOUND} 
      href='/vehicles' 
    />
  );
}

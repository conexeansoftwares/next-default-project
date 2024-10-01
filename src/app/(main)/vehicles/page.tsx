
import { getAllActiveVehiclesAction, IGetAllActiveVehiclesReturnProps } from '@/actions/vehicles/getAllActiveVehicles';
import { Vehicles } from './_components/vehicles';

export default async function Page() {
  const result: IGetAllActiveVehiclesReturnProps =
    await getAllActiveVehiclesAction({ id: true, licensePlate: true, carModel: true, owner: true });

  return <Vehicles result={result} />;
}

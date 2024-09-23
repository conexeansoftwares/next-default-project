
import { getAllActiveVehiclesAction } from '@/actions/vehicles/getAllActiveVehicles';
import { Vehicles } from './_components/vehicles';
import { GetAllVehiclesActionResult } from './types';

export default async function Page() {
  const result: GetAllVehiclesActionResult =
    await getAllActiveVehiclesAction({ id: true, licensePlate: true, carModel: true, owner: true });

  return <Vehicles result={result} />;
}

import { getAllActiveVehicles } from '../../../actions/vehicles/getAllActiveVehicles';
import { Vehicles } from './_components/vehicles';

export default async function Page() {
  const { success, data, message } = await getAllActiveVehicles();

  return <Vehicles success={success} data={data} message={message} />;
}

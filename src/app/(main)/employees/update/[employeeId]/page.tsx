import { getActiveEmployeeByIdAction } from '@/actions/employees/getActiveEmployeeByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditEmployee from './_components/editEmployee';

export default async function Page({
  params,
}: {
  params: { employeeId: string };
}) {
  const response = await getActiveEmployeeByIdAction(params.employeeId);

  console.log(response);

  if (response.success) {
    return <EditEmployee {...response.data} />;
  }

  return (
    <EntityNotFound 
      title='Colaborador não encontrado ou inativo.' 
      href='/employees' 
    />
  );
}

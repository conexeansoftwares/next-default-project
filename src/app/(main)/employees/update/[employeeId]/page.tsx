import { getActiveEmployeeByIdAction, IGetActiveEmployeeReturnProps } from '@/actions/employees/getActiveEmployeeByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditEmployee from './_components/editEmployee';
import { MESSAGE } from '@/utils/message';

export default async function Page({
  params,
}: {
  params: { employeeId: string };
}) {

  const employeeId = parseInt(params.employeeId, 10);
  const response: IGetActiveEmployeeReturnProps = await getActiveEmployeeByIdAction(employeeId);

  if (response.success && response.data) {
    return <EditEmployee {...response.data} />;
  }

  return (
    <EntityNotFound 
      title={response.error || MESSAGE.EMPLOYEE.NOT_FOUND} 
      href='/employees' 
    />
  );
}

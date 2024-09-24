import {
  getAllActiveEmployeesAction,
  IGetAllACtiveEmplyeesReturnProps,
} from '@/actions/employees/getAllActiveEmployee';
import { Employees } from './_components/employees';

export default async function Page() {
  const result: IGetAllACtiveEmplyeesReturnProps =
    await getAllActiveEmployeesAction();

  return <Employees result={result} />;
}

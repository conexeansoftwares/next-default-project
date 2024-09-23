import { getAllActiveEmployeesAction } from '@/actions/employees/getAllActiveEmployee';
import { Employees } from './_components/employees';
import { GetAllActiveEmployeesActionResult } from './types';

export default async function Page() {
  const result: GetAllActiveEmployeesActionResult =
    await getAllActiveEmployeesAction({ id: true, fullName: true, registration: true, companies: true });

  return <Employees result={result} />;
}

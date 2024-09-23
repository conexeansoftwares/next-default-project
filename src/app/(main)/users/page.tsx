import { getAllActiveUsersAction } from '@/actions/users/getAllActivesUsersAction';
import { Users } from './_components/users';
import { GetAllActiveUsersActionResult } from './types';

export default async function Page() {
  const result: GetAllActiveUsersActionResult = await getAllActiveUsersAction();

  return <Users result={result} />;
}

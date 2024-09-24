import { getAllActiveUsersAction, IGetAllActiveUsersReturnProps } from '@/actions/users/getAllActivesUsersAction';
import { Users } from './_components/users';

export default async function Page() {
  const result: IGetAllActiveUsersReturnProps  = await getAllActiveUsersAction();

  return <Users result={result} />;
}

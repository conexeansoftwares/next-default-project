import { getAllActiveUsersAction } from '@/actions/users/getAllActivesUsersAction';
import { Users } from './_components/users';

export default async function Page() {
  const { success, data, message } = await getAllActiveUsersAction();

  return <Users success={success} data={data} message={message} />;
}

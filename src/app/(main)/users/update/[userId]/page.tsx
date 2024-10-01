import { getActiveUserByIdAction, IGetActiveUserByIdReturnProps } from '@/actions/users/getActiveUserByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditUser from './_components/editUser';
import { MESSAGE } from '@/utils/message';

export default async function Page({
  params,
}: {
  params: { userId: string };
}) {

  const userId = parseInt(params.userId, 10);
  const response: IGetActiveUserByIdReturnProps = await getActiveUserByIdAction(userId);

  if (response.success && response.data) {
    return <EditUser user={response.data} />;
  }

  return (
    <EntityNotFound title={response.error || MESSAGE.USER.NOT_FOUND} href='/users' />
  );
}

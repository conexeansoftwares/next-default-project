import { getActiveUserByIdAction } from '@/actions/users/getActiveUserByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditUser from './_components/editUser';

export default async function Page({
  params,
}: {
  params: { userId: string };
}) {
  const response = await getActiveUserByIdAction(params.userId);

  if (response.success && response.data) {
    return <EditUser user={response.data} />;
  }

  return (
    <EntityNotFound title='Usuário não encontrado ou inativo.' href='/users' />
  );
}

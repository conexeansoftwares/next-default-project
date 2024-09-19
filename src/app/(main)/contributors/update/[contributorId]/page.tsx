
import { getActiveContributorByIdAction } from '@/actions/contributors/getActiveContributorByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditContributor from './_components/editContributor';

export default async function Page({
  params,
}: {
  params: { contributorId: string };
}) {
  const response = await getActiveContributorByIdAction(params.contributorId);

  if (response.success && response.data) {
    return <EditContributor {...response.data} />;
  }

  return (
    <EntityNotFound title='Colaborador não encontrado ou inativo.' href='/contributors' />
  );
}

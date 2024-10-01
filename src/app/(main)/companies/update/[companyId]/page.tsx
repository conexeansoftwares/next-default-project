import {
  getActiveCompanyByIdAction,
  IGetActiveCompanyByIdReturnProps,
} from '../../../../../actions/companies/getActiveCompanyByIdAction';
import EditCompany from './_components/editCompany';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import { MESSAGE } from '@/utils/message';

export default async function Page({
  params,
}: {
  params: { companyId: string };
}) {
  const companyId = parseInt(params.companyId, 10);
  const response: IGetActiveCompanyByIdReturnProps =
    await getActiveCompanyByIdAction(companyId);

  if (response.success && response.data) {
    return <EditCompany {...response.data} />;
  }

  return (
    <EntityNotFound
      title={response.error || MESSAGE.COMPANY.NOT_FOUND}
      href="/companies"
    />
  );
}

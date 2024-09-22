import { getActiveCompanyByIdAction } from '../../../../../actions/companies/getActiveCompanyByIdAction';
import EditCompany from './_components/editCompany';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';

export default async function Page({
  params,
}: {
  params: { companyId: string };
}) {
  const response = await getActiveCompanyByIdAction(params.companyId);

  if (response.success) {
    return <EditCompany {...response.data} />;
  }

  return (
    <EntityNotFound 
      title='Empresa não encontrada ou inativa.' 
      href='/companies' 
    />
  );
}

import { getAllActiveCompanies, IGetAllActiveCompaniesReturnProps } from '../../../actions/companies/getAllActiveCompanies';
import { Companies } from './_components/companies';

export default async function Page() {
  const result: IGetAllActiveCompaniesReturnProps = await getAllActiveCompanies({});

  return (
    <Companies result={result} />
  );
}

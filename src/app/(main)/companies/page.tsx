import { getAllActiveCompanies } from '../../../actions/companies/getAllActiveCompanies';
import { Companies } from './_components/companies';
import { GetAllActiveCompanyActionResult } from '@/app/(main)/companies/types';

export default async function Page() {
  const result: GetAllActiveCompanyActionResult = await getAllActiveCompanies();

  return (
    <Companies result={result} />
  );
}

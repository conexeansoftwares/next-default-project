import { getAllActiveCompanies } from '../../../actions/companies/getAllActiveCompanies';
import { Companies } from './_components/companies';

export default async function Page() {
  const { success, data, message } = await getAllActiveCompanies();

  return (
    <Companies success={success} data={data} message={message} />
  );
}

import { getAllActiveContributors } from '@/actions/contributors/getAllActiveContributors';
import { Contributors } from './_components/contributors';

export default async function Page() {
  const { success, data, message } = await getAllActiveContributors();

  return <Contributors success={success} data={data} message={message} />;
}

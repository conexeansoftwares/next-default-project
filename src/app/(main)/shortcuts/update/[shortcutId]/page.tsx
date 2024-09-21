import { getShortcutByIdAction } from '@/actions/shortcuts/getShortcutByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditShortcut from './_components/editShortcut';

export default async function Page({
  params,
}: {
  params: { shortcutId: string };
}) {
  const response = await getShortcutByIdAction(params.shortcutId);

  if (response.success && response.data) {
    return <EditShortcut {...response.data} />;
  }

  return (
    <EntityNotFound title='Atalho não encontrado ou inesistente.' href='/shortcuts' />
  );
}

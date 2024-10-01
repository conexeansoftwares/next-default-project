import { getShortcutByIdAction, IGetShortcutByIdReturnProps } from '@/actions/shortcuts/getShortcutByIdAction';
import { EntityNotFound } from '../../../../../components/ui/entityNotFound';
import EditShortcut from './_components/editShortcut';
import { MESSAGE } from '@/utils/message';

export default async function Page({
  params,
}: {
  params: { shortcutId: string };
}) {

  const shortcutId = parseInt(params.shortcutId, 10);
  const response: IGetShortcutByIdReturnProps = await getShortcutByIdAction(shortcutId);

  if (response.success && response.data) {
    return <EditShortcut {...response.data} />;
  }

  return (
    <EntityNotFound title={response.error || MESSAGE.SHORTCUT.NOT_FOUND} href='/shortcuts' />
  );
}

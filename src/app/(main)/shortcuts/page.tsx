import { getAllShortcuts } from '@/actions/shortcuts/getAllShortcuts';
import { PageComponent } from '@/components/ui/page';
import { ShortcutList } from './_components/shortcutList';

export default async function Page() {
  const { success, data } = await getAllShortcuts();

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Atalhos" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <ShortcutList success={success} data={data} />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

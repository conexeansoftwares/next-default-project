import React from 'react';
import { PageComponent } from '@/components/ui/page';

export default function Page() {
  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Acesso negado" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <h1>Você não tem permissão</h1>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

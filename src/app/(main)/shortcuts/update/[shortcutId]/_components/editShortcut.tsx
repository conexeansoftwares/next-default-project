'use client';

import { PageComponent } from '../../../../../../components/ui/page';
import { useToast } from '../../../../../../hooks/use-toast';
import { IShortcut } from '../../../types';
import { ShortcutForm } from '../../../_components/shortcutForm';
import React from 'react';
import { ShortcutFormData } from '@/schemas/shortcutSchema';
import { editShortcutAction } from '@/actions/shortcuts/editShortcutAction';

export default function EditShortcut(shortcut: IShortcut) {
  const { toast } = useToast();

  async function onSubmit(values: ShortcutFormData) {
    const response = await editShortcutAction(shortcut.id, values);

    if (response.success) {
      toast({
        variant: 'success',
        description: 'Atalho editado com sucesso!',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ah não. Algo deu errado.',
        description: 'Não foi possível editar atalho.',
      });
    }
  }

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Editar atalho" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <ShortcutForm
          initialData={shortcut}
          onSubmit={onSubmit}
          submitButtonText="Atualizar empresa"
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

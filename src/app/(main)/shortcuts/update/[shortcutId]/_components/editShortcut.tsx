'use client';

import { PageComponent } from '../../../../../../components/ui/page';
import { useToast } from '../../../../../../hooks/use-toast';
import { IShortcut } from '../../../types';
import { ShortcutForm } from '../../../_components/shortcutForm';
import React from 'react';
import { ShortcutFormData } from '@/schemas/shortcutSchema';
import { editShortcutAction } from '@/actions/shortcuts/editShortcutAction';
import { MESSAGE } from '@/utils/message';

export default function EditShortcut(shortcut: IShortcut) {
  const { toast } = useToast();

  async function onSubmit(values: ShortcutFormData) {
    const response = await editShortcutAction(shortcut.id, values);

    if (response.success) {
      toast({
        variant: 'success',
        description: response.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: response.error,
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

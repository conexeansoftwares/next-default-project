'use client';

import { PageComponent } from '../../../../components/ui/page';
import { useToast } from '../../../../hooks/useToast';
import { useRef } from 'react';
import { ShortcutFormData } from '@/schemas/shortcutSchema';
import { ShortcutForm } from '../_components/shortcutForm';
import { createShortcutAction } from '@/actions/shortcuts/createShortcutAction';
import { MESSAGE } from '@/utils/message';

export default function CreateShortcutPage() {
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void } | null>(null);

  async function onSubmit(values: ShortcutFormData) {
    const response = await createShortcutAction(values);

    if (response.success) {
      toast({
        variant: 'success',
        description: response.message,
      });

      if (formRef.current) {
        formRef.current.reset();
      }
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
        <PageComponent.Title text="Cadastrar atalho" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <ShortcutForm 
          ref={formRef}
          onSubmit={onSubmit} 
          submitButtonText="Cadastrar atalho" 
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

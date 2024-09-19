'use client';

import { ContributorFormData } from '@/schemas/contributorSchema';
import { PageComponent } from '../../../../components/ui/page';
import { useToast } from '../../../../hooks/use-toast';
import { useRef } from 'react';
import { createContributorAction } from '@/actions/contributors/createContributorAction';
import { ContributorForm } from '../_components/contributorForm';

export default function CreateContributorPage() {
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void } | null>(null);

  async function onSubmit(values: ContributorFormData) {
    const response = await createContributorAction(values);

    if (response.success) {
      toast({
        variant: 'success',
        description: 'Colaborador cadastrado com sucesso!',
      });

      if (formRef.current) {
        formRef.current.reset();
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Ah não. Algo deu errado.',
        description: 'Não foi possível cadastrar colaborador.',
      });
    }
  }

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Cadastrar colaborador" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <ContributorForm 
          ref={formRef}
          onSubmit={onSubmit} 
          submitButtonText="Cadastrar colaborador" 
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

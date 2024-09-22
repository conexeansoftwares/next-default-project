'use client';

import { useToast } from '../../../../../../hooks/use-toast';
import { PageComponent } from '../../../../../../components/ui/page';
import { IContributorToEdit } from '../../../types';
import { ContributorFormData } from '@/schemas/contributorSchema';
import { editContributorAction } from '@/actions/contributors/editContributorAction';
import { ContributorForm } from '../../../_components/contributorForm';

export default function EditContributor(contributor: IContributorToEdit) {
  const { toast } = useToast();

  async function onSubmit(values: ContributorFormData) {
    const response = await editContributorAction(contributor.id, values);

    if (response.success) {
      toast({
        variant: 'success',
        description: 'Colaborador editado com sucesso!',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ah não. Algo deu errado.',
        description: 'Não foi possível editar colaborador.',
      });
    }
  }

  // Prepare initialData to match ContributorFormData type
  const initialData: Partial<ContributorFormData> = {
    fullName: contributor.fullName,
    registration: contributor.registration,
    companyIds: contributor.companyIds,
    internalPassword: contributor.internalPassword || undefined,
    telephone: contributor.telephone || undefined,
    observation: contributor.observation || undefined,
    photoURL: contributor.photoURL || undefined,
  };

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Editar colaborador" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <ContributorForm
          initialData={initialData}
          onSubmit={onSubmit}
          submitButtonText="Atualizar colaborador"
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

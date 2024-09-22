'use client';

import { CompanyFormData } from '../../../../../../schemas/companySchema';
import { PageComponent } from '../../../../../../components/ui/page';
import { useToast } from '../../../../../../hooks/use-toast';
import { ICompany } from '../../../types';
import { editCompanyAction } from '../../../../../../actions/companies/editCompanyAction';
import { CompanyForm } from '../../../_components/companyForm';
import { formatCNPJ } from '../../../../../../utils/cnpjUtils';
import { MESSAGE } from '@/utils/message';

export default function EditCompany(company: ICompany) {
  const { toast } = useToast();

  const initialData = {
    ...company,
    cnpj: formatCNPJ(company.cnpj),
  };

  async function onSubmit(values: CompanyFormData) {
    const response = await editCompanyAction(company.id, values);

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
        <PageComponent.Title text="Editar empresa" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <CompanyForm
          initialData={initialData}
          onSubmit={onSubmit}
          submitButtonText="Atualizar empresa"
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

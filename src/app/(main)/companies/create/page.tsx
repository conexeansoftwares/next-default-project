'use client';

import { CompanyFormData } from '../../../../schemas/companySchema';
import { PageComponent } from '../../../../components/ui/page';
import { useToast } from '../../../../hooks/use-toast';
import { createCompanyAction } from '../../../../actions/companies/createCompanyAction';
import { CompanyForm } from '../_components/companyForm';
import { useRef } from 'react';
import { MESSAGE } from '@/utils/message';

export default function CreateCompanyPage() {
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void } | null>(null);

  async function onSubmit(values: CompanyFormData) {
    const response = await createCompanyAction(values);

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
        <PageComponent.Title text="Cadastrar empresa" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <CompanyForm 
          ref={formRef}
          onSubmit={onSubmit} 
          submitButtonText="Cadastrar empresa" 
        />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

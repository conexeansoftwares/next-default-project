'use client';

import { CompanyFormData } from '../../../../schemas/companySchema';
import { PageComponent } from '../../../../components/ui/page';
import { useToast } from '../../../../hooks/useToast';
import { createCompanyAction } from '../../../../actions/companies/createCompanyAction';
import { CompanyForm } from '../_components/companyForm';
import { useRef } from 'react';

export default function CreateCompanyPage() {
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void } | null>(null);

  async function onSubmit(values: CompanyFormData) {
    try {
      const message = await createCompanyAction(values);
      
      toast({
        variant: 'success',
        description: message,
      });

      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.log(error);
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

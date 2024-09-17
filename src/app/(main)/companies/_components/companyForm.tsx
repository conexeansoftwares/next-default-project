// components/CompanyForm.tsx
'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanyFormData, companyFormSchema } from '../../../../schemas/companySchema';
import { Button } from '../../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import Link from 'next/link';
import { CircleArrowLeft } from 'lucide-react';

interface CompanyFormProps {
  initialData?: CompanyFormData;
  onSubmit: (values: CompanyFormData) => Promise<void>;
  submitButtonText: string;
}

export const CompanyForm = forwardRef<{ reset: () => void }, CompanyFormProps>(
  ({ initialData, onSubmit, submitButtonText }, ref) => {
    const form = useForm<CompanyFormData>({
      resolver: zodResolver(companyFormSchema),
      defaultValues: initialData || {
        name: '',
        cnpj: '',
      },
    });

    useImperativeHandle(ref, () => ({
      reset: () => form.reset(),
    }));

    return (
      <>
        <div className="w-full flex justify-end">
          <Link href={'/companies'}>
            <Button>
              <CircleArrowLeft className="w-4 h-4 me-2" /> Voltar
            </Button>
          </Link>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe o nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o CNPJ"
                        mask="##.###.###/####-##"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end w-100 mt-6">
              <Button type="submit">{submitButtonText}</Button>
            </div>
          </form>
        </Form>
      </>
    );
  }
);

CompanyForm.displayName = 'CompanyForm';

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserFormData, userFormSchema } from '@/schemas/userSchema';
import { createUserAction } from '@/actions/users/createUserAction';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PageComponent } from '@/components/ui/page';
import Link from 'next/link';

import { CircleArrowLeft } from 'lucide-react';

export default function Page() {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: UserFormData) {
    console.log(`OnSubmit: ${JSON.stringify(values)}`);
    await createUserAction(values);
    console.log('Chamada deu certo');
  }

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Cadastrar usuário" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <div className="w-full flex justify-end">
          <Link href={'/users'}>
            <Button>
              <CircleArrowLeft className="w-4 h-4 me-2" /> Voltar
            </Button>
          </Link>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe o sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe o e-mail" type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid gird-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4'>
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha *</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe a senha" type='password' {...field} />
                    </FormControl>
                    <FormDescription>Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme a senha *</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirme a senha" type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end w-100 mt-6">
              <Button type="submit">Cadastrar usuário</Button>
            </div>
          </form>
        </Form>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

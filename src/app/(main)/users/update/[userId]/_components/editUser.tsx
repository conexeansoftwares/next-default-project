// src/app/(main)/users/[userId]/_components/editUser.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserFormData, userFormSchema } from '@/schemas/userSchema';
import { editUserAction } from '@/actions/users/editUserAction';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PageComponent } from '@/components/ui/page';
import Link from 'next/link';
import { CheckIcon, CircleArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useMemo, useState } from 'react';
import { getAllActiveContributorsToSelect } from '@/actions/contributors/getAllActiveContributorsToSelect';
import { IContributorToSelect } from '../../../../contributors/types';
import { useToast } from '@/hooks/use-toast';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IUserToEdit, IUserPermission } from '../../../types';

const modules = [
  { id: 'users', name: 'Usuários' },
  { id: 'companies', name: 'Empresas' },
  { id: 'vehicles', name: 'Veículos' },
  { id: 'movements', name: 'Movimentações' },
];

const permissions = ['Ler', 'Escrever', 'Deletar', 'Admin'];

export default function EditUser({ user }: { user: IUserToEdit }) {
  const [requesting, setRequesting] = useState<boolean>(false);
  const [contributors, setContributors] = useState<IContributorToSelect[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filteredModules = useMemo(
    () => modules.filter((module) => module.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const { toast } = useToast();

  const convertPermissionsToFormFormat = (userPermissions: IUserPermission[]): Record<string, Record<string, boolean>> => {
    const formattedPermissions: Record<string, Record<string, boolean>> = {};
    userPermissions.forEach(({ module, permission }) => {
      if (!formattedPermissions[module]) {
        formattedPermissions[module] = {};
      }
      formattedPermissions[module][permission.toLowerCase()] = true;
    });
    return formattedPermissions;
  };

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user.email,
      contributorId: user.contributorId || '',
      permissions: convertPermissionsToFormFormat(user.userPermissions),
    },
  });

  async function onSubmit(values: UserFormData) {
    setRequesting(true);
    const response = await editUserAction(user.id, values);

    if (response.success) {
      toast({
        variant: 'success',
        title: 'Usuário editado com sucesso.',
        description: response.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ah não. Ocorreu um erro.',
        description: response.message,
      });
    }
    setRequesting(false);
  }

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const fetchedContributors = await getAllActiveContributorsToSelect();
        if (fetchedContributors.success) {
          setContributors(fetchedContributors.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Erro ao carregar colaboradores',
            description: 'Não foi possível carregar a lista de colaboradores.',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar colaboradores',
          description: 'Não foi possível carregar a lista de colaboradores.',
        });
      }
    };

    fetchCollaborators();
  }, [toast]);

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Editar usuário" />
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className='col-span-full'>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe o e-mail" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contributorId"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-full">
                    <FormLabel>Colaborador *</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? contributors.find((contributor) => contributor.id === field.value)?.fullName
                              : 'Selecione o colaborador'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Procurar colaborador..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>Nenhum colaborador encontrado.</CommandEmpty>
                            <CommandGroup>
                              {contributors.map((contributor) => (
                                <CommandItem
                                  value={contributor.fullName}
                                  key={contributor.id}
                                  onSelect={() => {
                                    form.setValue('contributorId', contributor.id);
                                    setOpen(false);
                                  }}
                                >
                                  {contributor.fullName}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      contributor.id === field.value ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-secondary/90 rounded-lg p-4 col-span-full">
                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Permissões de Módulos</FormLabel>
                      </div>
                      <FormControl>
                        <Command className="rounded-lg border shadow-md">
                          <CommandInput placeholder="Procurar módulo..." onValueChange={setSearchQuery} />
                          <CommandList className="max-h-full">
                            {filteredModules.length === 0 && searchQuery !== '' && (
                              <CommandEmpty>Nenhum módulo encontrado.</CommandEmpty>
                            )}
                            <CommandGroup>
                              <ScrollArea className="h-[300px] w-full p-4">
                                {filteredModules.map((module) => (
                                  <CommandItem key={module.id} value={module.name} className="px-2 py-3">
                                    <div className="w-full">
                                      <FormLabel className="text-sm font-semibold">{module.name}</FormLabel>
                                      <div className="flex flex-wrap gap-4 mt-2">
                                        {permissions.map((permission) => (
                                          <FormItem
                                            key={`${module.id}-${permission}`}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.[module.id]?.[permission.toLowerCase()] || false}
                                                onCheckedChange={(checked) => {
                                                  const updatedPermissions = { ...field.value };
                                                  if (!updatedPermissions[module.id]) {
                                                    updatedPermissions[module.id] = {};
                                                  }
                                                  updatedPermissions[module.id][permission.toLowerCase()] = checked === true;
                                                  field.onChange(updatedPermissions);
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">{permission}</FormLabel>
                                          </FormItem>
                                        ))}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end w-100 mt-6">
              <Button type="submit" disabled={requesting}>
                {requesting ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

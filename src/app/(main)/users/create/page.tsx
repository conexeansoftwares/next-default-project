'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CombinedUserForm,
  combinedUserFormSchema,
} from '../../../../schemas/userSchema';
import { createUserAction, ICreateUserReturnProps } from '../../../../actions/users/createUserAction';
import { Button } from '../../../../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { PageComponent } from '../../../../components/ui/page';
import Link from 'next/link';
import { CheckIcon, CircleArrowLeft, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/useToast';
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
import { MESSAGE } from '@/utils/message';
import { IEmployeeToSelect } from '../../employees/types';
import { modules } from '../modules';
import {
  getAllActiveEmployeesToSelectAction,
  IGetAllACtiveEmplyeesToSelectReturnProps,
} from '@/actions/employees/getAllActiveEmployeeToSelect';

export default function UserPage() {
  const [requesting, setRequesting] = useState<boolean>(false);
  const [contributors, setContributors] = useState<IEmployeeToSelect[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const filteredModules = useMemo(
    () =>
      modules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const form = useForm<CombinedUserForm>({
    resolver: zodResolver(combinedUserFormSchema),
    defaultValues: {
      email: '',
      employeeId: '',
      permissions: {},
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: CombinedUserForm) {
    setRequesting(true);

    const response: ICreateUserReturnProps = await createUserAction(values);

    if (response.success) {
      toast({
        variant: 'success',
        description: response.data,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: response.error,
      });
    }

    setRequesting(false);
  }

  useEffect(() => {
    const fetchContributors = async () => {
      const response: IGetAllACtiveEmplyeesToSelectReturnProps =
        await getAllActiveEmployeesToSelectAction();
      if (response.success && response.data) {
        setContributors(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
          description: response.error,
        });
      }
    };

    fetchContributors();
  }, [toast]);

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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o e-mail"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Informe a senha"
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                          aria-label={
                            showPassword ? 'Ocultar senha' : 'Mostrar senha'
                          }
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Senha deve conter pelo menos uma letra maiúscula, uma
                      minúscula, um número e um caractere especial.
                    </FormDescription>
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
                      <div className="relative">
                        <Input
                          placeholder="Confirme a senha"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={toggleConfirmPasswordVisibility}
                          aria-label={
                            showConfirmPassword
                              ? 'Ocultar senha'
                              : 'Mostrar senha'
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeId"
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
                              ? contributors.find(
                                  (contributor) =>
                                    contributor.id === field.value,
                                )?.fullName
                              : 'Selecione o colaborador'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Procurar colaborador..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              Nenhum colaborador encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {contributors.map((contributor) => (
                                <CommandItem
                                  value={contributor.fullName}
                                  key={contributor.id}
                                  onSelect={() => {
                                    form.setValue('employeeId', contributor.id);
                                    setOpen(false);
                                  }}
                                >
                                  {contributor.fullName}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      contributor.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
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
                        <FormLabel className="text-base">
                          Permissões de Módulos
                        </FormLabel>
                        <FormDescription>
                          Selecione as permissões para cada módulo
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Command className="rounded-lg border shadow-md">
                          <CommandInput
                            placeholder="Procurar módulo..."
                            onValueChange={setSearchQuery}
                          />
                          <CommandList className="max-h-full">
                            {filteredModules.length === 0 &&
                              searchQuery !== '' && (
                                <CommandEmpty>
                                  Nenhum módulo encontrado.
                                </CommandEmpty>
                              )}
                            <CommandGroup>
                              <ScrollArea className="h-[300px] w-full p-4">
                                {filteredModules.map((module) => (
                                  <CommandItem
                                    key={module.id}
                                    value={module.name}
                                    className="px-2 py-3"
                                  >
                                    <div className="w-full">
                                      <FormLabel className="text-sm font-semibold">
                                        {module.name}
                                      </FormLabel>
                                      <div className="flex flex-wrap gap-4 mt-2">
                                        {module.permissions.map(
                                          (permission) => (
                                            <FormItem
                                              key={`${module.id}-${permission}`}
                                              className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={
                                                    field.value?.[module.id]?.[
                                                      permission.toLowerCase()
                                                    ] || false
                                                  }
                                                  onCheckedChange={(
                                                    checked,
                                                  ) => {
                                                    const updatedPermissions = {
                                                      ...field.value,
                                                    };
                                                    if (
                                                      !updatedPermissions[
                                                        module.id
                                                      ]
                                                    ) {
                                                      updatedPermissions[
                                                        module.id
                                                      ] = {};
                                                    }
                                                    updatedPermissions[
                                                      module.id
                                                    ][
                                                      permission.toLowerCase()
                                                    ] = checked === true;
                                                    field.onChange(
                                                      updatedPermissions,
                                                    );
                                                  }}
                                                />
                                              </FormControl>
                                              <FormLabel className="text-sm font-normal">
                                                {permission}
                                              </FormLabel>
                                            </FormItem>
                                          ),
                                        )}
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
                {requesting ? 'Registrando...' : 'Registrar usuário'}
              </Button>
            </div>
          </form>
        </Form>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

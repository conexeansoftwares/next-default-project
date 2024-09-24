'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editUserAction,
  IEditUserReturnProps,
} from '@/actions/users/editUserAction';
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
import {
  CheckIcon,
  CircleArrowLeft,
  Key,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
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
import { IUserToEdit, IUserPermission } from '../../../types';
import { MESSAGE } from '@/utils/message';
import { IEmployeeToSelect } from '@/app/(main)/employees/types';
import { getAllActiveEmployeesAction } from '@/actions/employees/getAllActiveEmployee';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PasswordFormSchema,
  passwordSchema,
  userFormSchemaWithoutPassword,
  UserFormWithoutPassword,
} from '@/schemas/userSchema';
import { IUpdateUserReturnProps, updateUserPasswordAction } from '@/actions/users/updatePasswordAction';
import { modules } from '../../../modules';
import {
  getAllActiveEmployeesToSelectAction,
  IGetAllACtiveEmplyeesToSelectReturnProps,
} from '@/actions/employees/getAllActiveEmployeeToSelect';

export default function EditUser({ user }: { user: IUserToEdit }) {
  const [requesting, setRequesting] = useState<boolean>(false);
  const [employees, setEmployees] = useState<IEmployeeToSelect[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const filteredModules = useMemo(
    () =>
      modules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const { toast } = useToast();

  const convertPermissionsToFormFormat = (
    userPermissions: IUserPermission[],
  ): Record<string, Record<string, boolean>> => {
    const formattedPermissions: Record<string, Record<string, boolean>> = {};
    userPermissions.forEach(({ module, permission }) => {
      if (!formattedPermissions[module]) {
        formattedPermissions[module] = {};
      }
      formattedPermissions[module][permission.toLowerCase()] = true;
    });
    return formattedPermissions;
  };

  const form = useForm<UserFormWithoutPassword>({
    resolver: zodResolver(userFormSchemaWithoutPassword),
    defaultValues: {
      email: user.email,
      employeeId: user.employeeId,
      permissions: convertPermissionsToFormFormat(user.userPermissions),
    },
  });

  const passwordForm = useForm<PasswordFormSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: UserFormWithoutPassword) {
    setRequesting(true);
    const response: IEditUserReturnProps = await editUserAction({
      userId: user.id,
      data: values,
    });

    if (response.success) {
      toast({
        variant: 'success',
        description: response.data,
      });
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: response.error,
      });
    }

    setRequesting(false);
  }

  async function onPasswordSubmit(values: PasswordFormSchema) {
    setRequesting(true);
    const response: IUpdateUserReturnProps = await updateUserPasswordAction({
      userId: user.id,
      data: values,
    });

    if (response.success) {
      toast({
        variant: 'success',
        description: response.data,
      });
      setIsChangePasswordOpen(false);
      passwordForm.reset();
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
    const fetchEmployees = async () => {
      const response: IGetAllACtiveEmplyeesToSelectReturnProps =
        await getAllActiveEmployeesToSelectAction();
      if (response.success && response.data) {
        setEmployees(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
          description: response.error,
        });
      }
    };

    fetchEmployees();
  }, [toast]);

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Editar usuário" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <div className="w-full flex justify-end gap-2">
          <Dialog
            open={isChangePasswordOpen}
            onOpenChange={setIsChangePasswordOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Key className="w-4 h-4 me-2" /> Alterar Senha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar Senha</DialogTitle>
              </DialogHeader>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
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
                  <div className="flex justify-end w-full">
                    <Button type="submit" disabled={requesting}>
                      {requesting ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
                              ? employees.find(
                                  (employee) => employee.id === field.value,
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
                              {employees.map((employee) => (
                                <CommandItem
                                  value={employee.fullName}
                                  key={employee.id}
                                  onSelect={() => {
                                    form.setValue('employeeId', employee.id);
                                    setOpen(false);
                                  }}
                                >
                                  {employee.fullName}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      employee.id === field.value
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
                {requesting ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

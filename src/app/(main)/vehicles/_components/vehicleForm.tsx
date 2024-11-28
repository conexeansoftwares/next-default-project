'use client';

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  ForwardRefRenderFunction,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  VehicleFormData,
  vehicleFormSchema,
} from '../../../../schemas/vehicleSchema';
import { Button } from '../../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import Link from 'next/link';
import { CheckIcon, CircleArrowLeft } from 'lucide-react';
import { useToast } from '../../../../hooks/useToast';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { MESSAGE } from '@/utils/message';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  getAllActiveCompaniesToSelect,
  IGetAllActiveCompaniesToSelectReturnProps,
} from '@/actions/companies/getAllActiveCompaniesToSelect';
import { ICompany } from '../../companies/types';

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit: (values: VehicleFormData) => Promise<void>;
  submitButtonText: string;
}

interface VehicleFormRef {
  reset: () => void;
}

const VehicleFormComponent: ForwardRefRenderFunction<
  VehicleFormRef,
  VehicleFormProps
> = ({ initialData, onSubmit, submitButtonText }, ref) => {
  const [companies, setCompanies] = useState<Omit<ICompany, 'cnpj'>[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      licensePlate: '',
      carModel: '',
      owner: '',
      companyId: 0,
      ...initialData,
    },
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.reset();
    },
  }));

  useEffect(() => {
    const fetchCompanies = async () => {
      const response: IGetAllActiveCompaniesToSelectReturnProps =
        await getAllActiveCompaniesToSelect();
      if (response.success && response.data) {
        setCompanies(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
          description: response.error,
        });
      }
    };

    fetchCompanies();
  }, [toast]);

  const handleSubmit = async (values: VehicleFormData) => {
    await onSubmit(values);  
  };

  return (
    <>
      <div className="w-full flex justify-end">
        <Link href={'/vehicles'}>
          <Button>
            <CircleArrowLeft className="w-4 h-4 me-2" /> Voltar
          </Button>
        </Link>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informe a placa"
                      uppercase
                      alphanumeric
                      maxLength={7}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Apenas letras e números. Ex: AAA1111
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe o modelo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dono</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe o dono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem className="flex flex-col col-span-full">
                <FormLabel>Empresa *</FormLabel>
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
                          ? companies.find(
                              (company) => company.id === field.value,
                            )?.name
                          : 'Selecione a empresa'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Procurar empresa..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
                        <CommandGroup>
                          {companies.map((company) => (
                            <CommandItem
                              value={company.name}
                              key={company.id}
                              onSelect={() => {
                                form.setValue('companyId', company.id);
                                setOpen(false);
                              }}
                            >
                              {company.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  company.id === field.value
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
          <div className="flex justify-end w-100 mt-6">
            <Button type="submit">{submitButtonText}</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export const VehicleForm = forwardRef<VehicleFormRef, VehicleFormProps>(
  VehicleFormComponent,
);

VehicleForm.displayName = 'VehicleForm';

export default VehicleForm;

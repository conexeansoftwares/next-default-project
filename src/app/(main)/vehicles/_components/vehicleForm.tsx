import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Input } from '../../../../components/ui/input';
import Link from 'next/link';
import { CircleArrowLeft } from 'lucide-react';
import {
  VehicleFormData,
  vehicleFormSchema,
} from '../../../../schemas/vehicleSchema';
import {
  ICompaniesReturnToSelectProps,
  ICompanyToSelect,
} from '../../../../app/(main)/companies/types';
import { getAllActiveCompaniesToSelect } from '../../../../actions/companies/getAllActiveCompaniesToSelect';
import { useToast } from '../../../../hooks/use-toast';

interface VehicleFormProps {
  initialData?: VehicleFormData;
  onSubmit: (values: VehicleFormData) => Promise<void>;
  submitButtonText: string;
}

export const VehicleForm = forwardRef<{ reset: () => void }, VehicleFormProps>(
  ({ initialData, onSubmit, submitButtonText }, ref) => {
    const [companies, setCompanies] = useState<ICompanyToSelect[]>([]);
    const [selectKey, setSelectKey] = useState(0);

    const form = useForm<VehicleFormData>({
      resolver: zodResolver(vehicleFormSchema),
      defaultValues: initialData || {
        licensePlate: '',
        carModel: '',
        owner: '',
        companyId: '',
      },
    });

    const companyId = useWatch({ control: form.control, name: 'companyId' });

    useImperativeHandle(ref, () => ({
      reset: () => {
        form.reset();
        setSelectKey((prev) => prev + 1);
      },
    }));

    const { toast } = useToast();

    useEffect(() => {
      const fetchCompanies = async () => {
        const result: ICompaniesReturnToSelectProps =
          await getAllActiveCompaniesToSelect();
        if (result.success) {
          setCompanies(result.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Ah não. Algo deu errado.',
            description: 'Não foi possível listar as empresas.',
          });
        }
      };

      fetchCompanies();
    }, [toast]);

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
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa *</FormLabel>
                    <FormControl>
                      <Select
                        key={selectKey}
                        onValueChange={field.onChange}
                        value={companyId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
  },
);

VehicleForm.displayName = 'VehicleForm';

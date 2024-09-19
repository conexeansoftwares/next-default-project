import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boolean, z } from 'zod';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getActiveVechileByLicensePlateAction } from '@/actions/vehicles/getActiveVehicleByLicensePlateAction';
import { IVehicleToMovement } from '../../vehicles/types';
import { useToast } from '../../../../hooks/use-toast';
import { VehicleFormData, vehicleFormSchema } from '@/schemas/vehicleSchema';

const searchVehicleSchema = z.object({
  licensePlate: z
    .string()
    .length(7, { message: 'Placa deve conter 7 caracteres' }),
});

type SearchVehicleFormData = z.infer<typeof searchVehicleSchema>;

const movementVehicleSchema = vehicleFormSchema.extend({
  id: z.string().cuid({ message: 'ID do veículo inválido' }),
  companyName: z.string().optional(),
  acao: z.enum(['entrada', 'saida']),
});

type MovementVehicleFormData = z.infer<typeof movementVehicleSchema>;

export function VehicleMovementForm() {
  const { toast } = useToast();

  const [licensePlateFound, setLicensePlateFoud] = useState<boolean>(false);
  const [searchingLicensePlate, setSearchingLicensePlate] =
    useState<boolean>(false);
  const [vehicle, setVehicle] = useState<IVehicleToMovement | null>(null);

  const searchVehicleForm = useForm<SearchVehicleFormData>({
    resolver: zodResolver(searchVehicleSchema),
    defaultValues: {
      licensePlate: '',
    },
  });

  const movementVehicleForm = useForm<MovementVehicleFormData>({
    resolver: zodResolver(movementVehicleSchema),
    defaultValues: {
      id: '',
      licensePlate: '',
      carModel: '',
      companyId: '',
      owner: '',
    },
  });

  const onSubmitSearchVehicleForm = async (data: SearchVehicleFormData) => {
    try {
      setSearchingLicensePlate(true);
      const response = await getActiveVechileByLicensePlateAction(
        data.licensePlate,
      );

      if (response.success) {
        setVehicle(response.data);
        setLicensePlateFoud(true);
        searchVehicleForm.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Veículo não encontrado ou não cadastrado.',
          description:
            'Verifique se existe o veículo na base de dados ou entre em contato com a administração.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ah não. Algo deu errado.',
        description:
          'Não foi possível encontrar o veículo. Entre com contado com a administração.',
      });
    } finally {
      setSearchingLicensePlate(false);
    }
  };

  const onSubmitMovementVehicleForm = async (data: MovementVehicleFormData) => {
    console.log(data);
  };

  return (
    <div className="space-y-6">
      {!licensePlateFound ? (
        <Form {...searchVehicleForm}>
          <form
            onSubmit={searchVehicleForm.handleSubmit(onSubmitSearchVehicleForm)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={searchVehicleForm.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={7}
                        uppercase
                        alphanumeric
                        placeholder="Informe a placa do veículo"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Informe somente números e letras da placa do veículo. Ex:
                      AAA1111.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={searchingLicensePlate}>
                {searchingLicensePlate ? 'Buscando...' : 'Buscar veículo'}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...movementVehicleForm}>
          <form
            onSubmit={movementVehicleForm.handleSubmit(
              onSubmitMovementVehicleForm,
            )}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <FormField
                control={movementVehicleForm.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        disabled
                        value={vehicle?.licensePlate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={movementVehicleForm.control}
                name="carModel"
                render={({ field }) => (
                  <FormItem className='col-span-1 md:col-span-3 lg:col-span-4 xl:col-span-2'>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        disabled
                        value={vehicle?.carModel}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={movementVehicleForm.control}
                name="owner"
                render={({ field }) => (
                  <FormItem className='col-span-1 md:col-span-full xl:col-span-3'>
                    <FormLabel>Dono</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        disabled
                        value={vehicle?.owner}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={movementVehicleForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className='col-span-1 md:col-span-full'>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        disabled
                        value={vehicle?.companyName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-full">
                <FormField
                  control={movementVehicleForm.control}
                  name="acao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ação</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant={
                            field.value === 'entrada' ? 'default' : 'outline'
                          }
                          onClick={() => field.onChange('entrada')}
                          className={
                            field.value === 'entrada'
                              ? 'bg-green-500 hover:bg-green-600'
                              : ''
                          }
                        >
                          Entrada
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === 'saida' ? 'default' : 'outline'
                          }
                          onClick={() => field.onChange('saida')}
                          className={
                            field.value === 'saida'
                              ? 'bg-red-500 hover:bg-red-600'
                              : ''
                          }
                        >
                          Saída
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className='col-span-full'>Registrar Movimentação</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

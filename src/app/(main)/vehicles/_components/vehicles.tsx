'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '@/components/ui/page';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/dataTable';
import { useToast } from '@/hooks/use-toast';
import { getColumns } from '../columns';
import { desactivateVehicleAction } from '@/actions/vehicles/desactiveVehicleAction';
import { IVehicle, IVehiclesReturnProps } from '../types';

export function Vehicles({ success, data, message }: IVehiclesReturnProps) {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<IVehicle[]>(data ?? []);

  if (!success) {
    toast({
      variant: 'destructive',
      title: 'Ah não. Algo deu errado.',
      description: message,
    });
  }

  const handleDelete = useCallback(async (vehicleId: string) => {
    try {
      const result = await desactivateVehicleAction(vehicleId);
      if (result.success) {
        toast({
          variant: 'success',
          description: 'Veículo desativado com sucesso!',
        });
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: result.message || 'Não foi possível desativar o veículo.',
        });
      }
    } catch (error) {
      console.error('Erro ao desativar veículo:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao desativar o veículo.',
      });
    }
  }, [toast]);

  const columns = getColumns({ onDelete: handleDelete });

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Veículos" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <div className="flex w-full justify-end">
          <Link href={'/vehicles/create'}>
            <Button className="mb-2">
              <CirclePlus className="w-4 h-4 me-2" />
              Cadastar veículo
            </Button>
          </Link>
        </div>
        <DataTable.Root columns={columns} data={vehicles}>
          <DataTable.Tools
            searchKey="licensePlate"
            searchPlaceholder="Filtrar por placa..."
          />
          <DataTable.Content columns={columns} />
          <DataTable.Pagination />
        </DataTable.Root>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { CirclePlus } from 'lucide-react';
import { PageComponent } from '../../../../components/ui/page';
import { Button } from '../../../../components/ui/button';
import { DataTable } from '../../../../components/ui/dataTable';
import { useToast } from '../../../../hooks/use-toast';
import { getColumns } from '../columns';
import { MESSAGE } from '@/utils/message';
import { GetAllVehiclesActionResult, IVehicle } from '../types';
import { deactivateVehicleAction } from '@/actions/vehicles/desactiveVehicleAction';

interface VehiclesProps {
  result: GetAllVehiclesActionResult;
}

export function Vehicles({ result }: VehiclesProps) {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<IVehicle[]>(
    result.success ? (result.data as IVehicle[]) : [],
  );

  useEffect(() => {
    if (!result.success) {
      toast({
        variant: 'warning',
        title: MESSAGE.COMMON.GENERIC_WARNING_TITLE,
        description: result.error,
      });
    }
  }, [result, toast]);

  const handleDelete = useCallback(
    async (vehicleId: string) => {
      const deleteResult = await deactivateVehicleAction(vehicleId);
      if (deleteResult.success) {
        toast({
          variant: 'success',
          description: deleteResult.message,
        });
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.id !== vehicleId),
        );
      } else {
        toast({
          variant: 'destructive',
          title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
          description: deleteResult.error,
        });
      }
    },
    [toast],
  );

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
              Cadastrar veículo
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

'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  UserRoundPen,
  UserRoundX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { DataTable } from '@/components/ui/dataTable';
import { IVehicle } from './types';

type VehicleColumnProps = {
  onDelete: (id: string) => void;
};

export const getColumns = ({
  onDelete,
}: VehicleColumnProps): ColumnDef<IVehicle>[] => [
  {
    accessorKey: 'licensePlate',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Placa" />
    ),
  },
  {
    accessorKey: 'carModel',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Modelo" />
    ),
  },
  {
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Ano" />
    ),
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Empresa" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const vehicle = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <Link href={`/vehicles/update/${vehicle.id}`}>
              <DropdownMenuItem className="justify-between">
                Editar <UserRoundPen className="w-4 h-4" />
              </DropdownMenuItem>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  Excluir <UserRoundX className="w-4 h-4" />
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá desativar
                    permanentemente o veículo e remover os dados associados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive"
                    onClick={() => onDelete(vehicle.id)}
                  >
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

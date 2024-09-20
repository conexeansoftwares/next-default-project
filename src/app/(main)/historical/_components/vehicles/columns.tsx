import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../../../components/ui/dataTable';
import { format } from 'date-fns';

export interface IVehicleMovement {
  licensePlate: string;
  carModel: string;
  companyName: string;
  action: 'E' | 'S';
  date: string;
}

export const getColumns = (): ColumnDef<IVehicleMovement>[] => [
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
    accessorKey: 'companyName',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Empresa" />
    ),
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Ação" />
    ),
    cell: ({ row }) => {
      const action = row.getValue('action') as 'E' | 'S';
      return (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
            action === 'E'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {action === 'E' ? 'Entrada' : 'Saída'}
        </span>
      );
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      return format(new Date(date), 'dd-MM-yyyy HH:mm');
    },
  },
];
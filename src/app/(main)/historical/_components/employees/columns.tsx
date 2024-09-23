import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../../../components/ui/dataTable';
import { format } from 'date-fns';
import { formatCPF } from '@/utils/cpfUtils';
import { formatCellphone } from '@/utils/telephoneUtils';

export interface IContributorMovement {
  name: string;
  lastName: string;
  registration: string;
  action: 'E' | 'S';
  date: string;
}

export const getColumns = (): ColumnDef<IContributorMovement>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Sobrenome" />
    ),
  },
  {
    accessorKey: 'registration',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Matrícula" />
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

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../../../components/ui/dataTable';
import { format } from 'date-fns';
import { formatCPF } from '@/utils/cpfUtils';
import { formatCellphone } from '@/utils/telephoneUtils';
import { IVisitorMovementSimplified } from '@/app/(main)/movements/types';

export interface IVisitorMovement {
  fullName: string;
  cpf: string;
  telephone: string;
  licensePlate: string;
  action: 'E' | 'S';
  date: string;
}

export const getColumns = (): ColumnDef<IVisitorMovementSimplified>[] => [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Nome completo" />
    ),
  },
  {
    accessorKey: 'cpf',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="CPF" />
    ),
    cell: ({ row }) => {
      const cpf = row.getValue('cpf') as string;
      const formattedCPF = formatCPF(cpf);
      return <div>{formattedCPF}</div>;
    },
  },
  {
    accessorKey: 'telephone',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Telefone" />
    ),
    cell: ({ row }) => {
      const telephone = row.getValue('telephone') as string;
      const formattedTelephone = formatCellphone(telephone);
      return <div>{formattedTelephone}</div>;
    },
  },
  {
    accessorKey: 'licensePlate',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Placa" />
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

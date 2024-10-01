import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../../../components/ui/dataTable';
import { format } from 'date-fns';
import { formatCPF } from '@/utils/cpfUtils';
import { formatCellphone } from '@/utils/telephoneUtils';
import { IVisitorMovementSimplified } from '@/app/(main)/movements/types';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

export interface IVisitorMovement {
  fullName: string;
  cpf: string;
  telephone: string;
  licensePlate: string;
  action: 'E' | 'S';
  date: string;
  observation?: string;
}

interface GetColumnsOptions {
  onExpand?: (rowId: string) => void;
  expandedRows?: Record<string, boolean>;
}

export const getColumns = ({
  onExpand,
  expandedRows = {},
}: GetColumnsOptions = {}): ColumnDef<IVisitorMovementSimplified>[] => {
  const baseColumns: ColumnDef<IVisitorMovementSimplified>[] = [
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        <DataTable.ColumnHeader column={column} title="Nome completo" />
      ),
    },
    {
      accessorKey: 'cpf',
      header: ({ column }) => (
        <DataTable.ColumnHeader column={column} title="CPF" className='hidden md:block' />
      ),
      cell: ({ row }) => {
        const cpf = row.getValue('cpf') as string;
        const formattedCPF = formatCPF(cpf);
        return <div className='hidden md:block'>{formattedCPF}</div>;
      },
    },
    {
      accessorKey: 'telephone',
      header: ({ column }) => (
        <DataTable.ColumnHeader column={column} title="Telefone" className='hidden md:block' />
      ),
      cell: ({ row }) => {
        const telephone = row.getValue('telephone') as string;
        const formattedTelephone = formatCellphone(telephone);
        return <div className='hidden md:block'>{formattedTelephone}</div>;
      },
    },
    {
      accessorKey: 'licensePlate',
      header: ({ column }) => (
        <DataTable.ColumnHeader
          column={column}
          title="Placa"
          className="hidden lg:block"
        />
      ),
      cell: ({ row }) => {
        const licensePlate = row.getValue('licensePlate') as string;
        return <div className="hidden lg:block">{licensePlate}</div>;
      },
    },
    {
      accessorKey: 'action',
      header: ({ column }) => (
        <DataTable.ColumnHeader
          column={column}
          title="Ação"
          className="hidden lg:block"
        />
      ),
      cell: ({ row }) => {
        const action = row.getValue('action') as 'E' | 'S';
        return (
          <span
            className={`px-2 py-1 rounded-lg text-xs font-semibold hidden lg:block ${
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
        <DataTable.ColumnHeader
          column={column}
          title="Data"
          className="hidden xl:block"
        />
      ),
      cell: ({ row }) => {
        const date = row.getValue('date') as string;
        return (
          <div className="hidden xl:block">
            {format(new Date(date), 'dd-MM-yyyy HH:mm')}
          </div>
        );
      },
    },
  ];

  if (onExpand) {
    const expandColumn: ColumnDef<IVisitorMovementSimplified> = {
      id: 'expand',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onExpand(row.id)}>
          {expandedRows[row.id] ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </Button>
      ),
    };
    return [...baseColumns, expandColumn];
  }

  return baseColumns;
};

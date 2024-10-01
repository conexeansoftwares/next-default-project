import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/dataTable';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

export interface IVehicleMovement {
  licensePlate: string;
  carModel: string;
  companyName: string;
  action: 'E' | 'S';
  date: string;
  observation: string | null;
}

interface GetColumnsOptions {
  onExpand?: (rowId: string) => void;
  expandedRows?: Record<string, boolean>;
}

export const getColumns = ({
  onExpand,
  expandedRows = {},
}: GetColumnsOptions = {}): ColumnDef<IVehicleMovement>[] => {
  const baseColumns: ColumnDef<IVehicleMovement>[] = [
    {
      accessorKey: 'licensePlate',
      header: ({ column }) => (
        <DataTable.ColumnHeader column={column} title="Placa" />
      ),
    },
    {
      accessorKey: 'carModel',
      header: ({ column }) => (
        <DataTable.ColumnHeader
          column={column}
          title="Modelo"
          className="hidden md:block"
        />
      ),
      cell: ({ row }) => {
        const carModel = row.getValue('carModel') as string;
        return <div className="hidden md:block">{carModel}</div>;
      },
    },
    {
      accessorKey: 'companyName',
      header: ({ column }) => (
        <DataTable.ColumnHeader
          column={column}
          title="Empresa"
          className="hidden lg:block"
        />
      ),
      cell: ({ row }) => {
        const companyName = row.getValue('companyName') as string;
        return <div className="hidden lg:block">{companyName}</div>;
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
    const expandColumn: ColumnDef<IVehicleMovement> = {
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

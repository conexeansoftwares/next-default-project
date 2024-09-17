'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  UserRoundPen,
  UserRoundX,
} from 'lucide-react';
import { User } from './types';

import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { DataTableColumnHeader } from '../../../components/ui/dataTable/dataTableColumnHeader';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'lastname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sobrenome" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      console.log(row);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem className="justify-between">
              Editar <UserRoundPen className="w-4 h-4" />
            </DropdownMenuItem>
            <DropdownMenuItem className="justify-between">
              Ecluir <UserRoundX className="w-4 h-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

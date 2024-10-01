'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, UserRoundPen, UserRoundX } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
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
} from '../../../components/ui/alert-dialog';
import Link from 'next/link';
import { DataTable } from '../../../components/ui/dataTable';
import { IUser } from './types';

type userColumnProps = {
  onDelete: (id: number) => void;
  canEditAndCreate: boolean;
  canDelete: boolean;
};

export const getColumns = ({
  onDelete,
  canEditAndCreate,
  canDelete,
}: userColumnProps): ColumnDef<IUser>[] => [
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="E-mail" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      if (!canEditAndCreate && !canDelete) {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            {canEditAndCreate && (
              <Link href={`/users/update/${user.id}`}>
                <DropdownMenuItem className="justify-between">
                  Editar <UserRoundPen className="w-4 h-4" />
                </DropdownMenuItem>
              </Link>
            )}
            {canDelete && (
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
                      permanentemente o colaborador e remover os dados
                      associados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={() => onDelete(user.id)}
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

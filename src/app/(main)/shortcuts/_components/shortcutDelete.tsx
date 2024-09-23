'use client';

import { useState } from 'react';
import { deleteShortcutAction } from '@/actions/shortcuts/deleteShortcutAction';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, UserRoundPen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { MESSAGE } from '@/utils/message';

export function ShortcutDelete({
  shortcutId,
  onDelete,
}: {
  shortcutId: string;
  onDelete: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    const result = await deleteShortcutAction(shortcutId);

    if (result.success) {
      toast({
        variant: 'success',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: result.error,
      });
    }

    onDelete();
    setIsAlertOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <Link href={`/shortcuts/update/${shortcutId}`}>
          <DropdownMenuItem className="justify-between">
            Editar <UserRoundPen className="w-4 h-4" />
          </DropdownMenuItem>
        </Link>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsAlertOpen(true);
              }}
              className="justify-between"
            >
              Excluir <Trash2 className="w-4 h-4" />
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja deletar?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá deletar permanentemente o atalho.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

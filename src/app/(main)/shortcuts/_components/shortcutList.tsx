'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import { ShortcutDelete } from './shortcutDelete';
import { useToast } from '@/hooks/useToast';
import { IShortcut } from '../types';
import { MESSAGE } from '@/utils/message';
import { useAuth } from '@/hooks/usePermissions';
import { IGetAllShortcutsReturnProps } from '@/actions/shortcuts/getAllShortcuts';

interface ShortcutProps {
  result: IGetAllShortcutsReturnProps;
}

export function ShortcutList({ result }: ShortcutProps) {
  const { toast } = useToast();
  const { checkPermission } = useAuth();

  const [shortcuts, setShortcuts] = useState<IShortcut[]>(
    result.success ? (result.data as IShortcut[]) : [],
  );

  const handleDelete = (deletedId: string) => {
    setShortcuts(shortcuts.filter((shortcut) => shortcut.id !== deletedId));
  };

  useEffect(() => {
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_WARNING_TITLE,
        description: result.error,
      });
    }
  }, [result, toast]);

  return (
    <>
      {checkPermission('shortcuts', 'WRITE') && (
        <div className="flex w-full justify-end mb-4">
          <Link href={'/shortcuts/create'}>
            <Button className="mb-2">
              <CirclePlus className="w-4 h-4 me-2" />
              Cadastrar atalho
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
        {shortcuts.map((shortcut, index) => (
          <a
            key={index}
            href={shortcut.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${shortcut.color} p-2 sm:p-4 aspect-square flex flex-col shadow-md justify-between items-center transition-transform duration-300 hover:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white`}
          >
            <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-normal text-center mt-1">
              {shortcut.label}
            </span>
            {checkPermission('shortcuts', 'DELETE') && (
              <ShortcutDelete
                shortcutId={shortcut.id}
                onDelete={() => handleDelete(shortcut.id)}
              />
            )}
          </a>
        ))}
      </div>
    </>
  );
}

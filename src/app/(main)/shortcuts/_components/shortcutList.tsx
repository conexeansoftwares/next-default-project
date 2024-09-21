'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import { ShortcutDelete } from './shortcutDelete';
import { useToast } from '@/hooks/use-toast';

interface Shortcut {
  id: string;
  url: string;
  label: string;
  color: string;
}

export function ShortcutList({ success, data }: { success: boolean, data: Shortcut[] }) {
  const { toast } = useToast();
  const [shortcuts, setShortcuts] = useState(data);

  const handleDelete = (deletedId: string) => {
    setShortcuts(shortcuts.filter(shortcut => shortcut.id !== deletedId));
  };

  if (!success) {
    toast({
      variant: 'destructive',
      title: 'Ah não. Algo deu errado.',
      description: 'Ocorreu um erro ao listar os atalhos. Entre com contato com a administração.',
    });
  }

  return (
    <>
      <div className="flex w-full justify-end mb-4">
        <Link href={'/shortcuts/create'}>
          <Button className="mb-2">
            <CirclePlus className="w-4 h-4 me-2" />
            Cadastrar atalho
          </Button>
        </Link>
      </div>
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
            <ShortcutDelete shortcutId={shortcut.id} onDelete={() => handleDelete(shortcut.id)} />
          </a>
        ))}
      </div>
    </>
  );
}

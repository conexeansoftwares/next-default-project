import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ISidebarNavigation {
  className?: string;
  children: ReactNode;
}

export function SidebarNavigation({ className, children }: ISidebarNavigation) {
  return (
    <nav
      className={cn(
        'grid items-start px-2 gap-y-1 text-sm font-medium lg:px-4',
        className,
      )}
    >
      {children}
    </nav>
  );
}

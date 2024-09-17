import { cn } from '../../../lib/utils';
import { ReactNode } from 'react';

interface ISidebarRoot {
  className?: string;
  children: ReactNode;
}

export function SidebarRoot({ className, children }: ISidebarRoot) {
  return (
    <div className={cn('flex h-full max-h-screen flex-col gap-2 gap-y-6', className)}>
      {children}
    </div>
  );
}

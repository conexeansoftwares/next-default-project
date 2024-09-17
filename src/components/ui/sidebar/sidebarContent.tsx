import { cn } from '../../../lib/utils';
import { ReactNode } from 'react';

interface ISidebarContent {
  className?: string;
  children: ReactNode;
}

export function SidebarContent({ className, children }: ISidebarContent) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

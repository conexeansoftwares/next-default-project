import { cn } from '../../../lib/utils';
import { ReactNode } from 'react';

interface ISidebarFooter {
  className?: string;
  children: ReactNode;
}

export function SidebarFooter({ className, children }: ISidebarFooter) {
  return <div className={cn('mt-auto py-4', className)}>{children}</div>;
}

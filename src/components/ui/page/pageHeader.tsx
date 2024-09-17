import { cn } from '../../../lib/utils';
import { ReactNode } from 'react';

interface IPageHeader {
  className?: string;
  children: ReactNode;
}

export function PageHeader({ className, children }: IPageHeader) {
  return <div className={cn('flex items-center', className)}>{children}</div>;
}

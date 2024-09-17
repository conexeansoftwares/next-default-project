import { cn } from '../../../lib/utils';
import { ReactNode } from 'react';

interface IPageContent {
  className?: string;
  children: ReactNode;
}

export function PageContent({ className, children }: IPageContent) {
  return (
    <div
      className={cn(
        'flex flex-1 rounded-lg border border-dashed shadow-sm p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

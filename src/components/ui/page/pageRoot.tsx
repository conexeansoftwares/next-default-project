import { cn } from '../../../lib/utils';
import { ReactNode } from 'react';

interface IPageRoot {
  className?: string;
  children: ReactNode;
}

export function PageRoot({ className, children }: IPageRoot) {
  return (
    <main
      className={cn(
        'flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6',
        className,
      )}
    >
      {children}
    </main>
  );
}

import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface IFormContent {
  className?: string;
  children: ReactNode;
}

export function FormContent({ className, children }: IFormContent) {
  return <div className={twMerge('grid gap-y-1 gap-x-6', className)}>{children}</div>;
}

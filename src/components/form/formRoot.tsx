import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface IFormRoot {
  className?: string;
  children: ReactNode;
}

export function FormRoot({ className, children }: IFormRoot) {
  return <div className={twMerge('', className)}>{children}</div>;
}

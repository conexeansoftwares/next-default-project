import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface IInput {
  className?: string;
  children: ReactNode;
}

export function InputRoot({ className, children }:IInput ) {
  return <div className={twMerge('flex flex-col gap-y-1', className)}>{children}</div>;
}

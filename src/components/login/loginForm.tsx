import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ILoginForm {
  className?: string;
  children: ReactNode;
}

export function LoginForm({ className, children }: ILoginForm) {
  return <div className={twMerge('', className)}>{children}</div>;
}

import { FormHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface IFormComponent extends FormHTMLAttributes<HTMLFormElement> {
  className?: string;
  children: ReactNode;
}

export function FormComponent({ className, children, ...rest }: IFormComponent) {
  return <form className={twMerge('flex flex-col gap-y-5', className)} {...rest}>{children}</form>;
}

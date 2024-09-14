import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface IButtonDeafult
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

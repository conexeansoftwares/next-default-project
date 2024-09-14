import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IInput
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id'> {
  name: string;
  id: string;
  className?: string;
  error: boolean;
}

export function InputDefault({
  name,
  id,
  onChange,
  className,
  value,
  error,
  ...rest
}: IInput) {
  const defaultStyle = `block w-full px-4 py-2 text-gray-700 bg-white border  rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring ${error ? 'border-red-200 focus:border-red-400 focus:ring-red-300' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-300'}`;

  return (
    <input
      type="text"
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      className={twMerge(
        defaultStyle,
        className,
      )}
      {...rest}
    />
  );
}

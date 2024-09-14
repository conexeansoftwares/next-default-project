import { twMerge } from 'tailwind-merge';

interface IInputError {
  className?: string;
  error?: string;
}

export function InputError({ className, error }: IInputError) {
  return (
    <span className={twMerge('text-red-500 text-sm h-4', className)}>
      {error || '\u00A0'}
    </span>
  );
}

import { twMerge } from 'tailwind-merge';

interface ILabel {
  htmlFor: string;
  error: boolean;
  className?: string;
  text: string;
}

export function InputLabel({ htmlFor, error, className, text }: ILabel) {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        `text-base ${error ? 'text-red-500' : 'text-gray-700'}`,
        className,
      )}
    >
      {text}
    </label>
  );
}

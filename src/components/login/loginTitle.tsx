import { twMerge } from 'tailwind-merge';

interface ILoginTitle {
  className?: string;
  title: string;
}

export function LoginTitle({ title, className }: ILoginTitle) {
  return (
    <h1
      className={twMerge(
        'text-2xl font-semibold tracking-wider text-gray-800',
        className,
      )}
    >
      {title}
    </h1>
  );
}

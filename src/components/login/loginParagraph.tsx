import { twMerge } from 'tailwind-merge';

interface ILoginParagraph {
  className?: string;
  paragraph: string;
}

export function LoginParagraph({ paragraph, className }: ILoginParagraph) {
  return (
    <p
      className={twMerge(
        'text-gray-500',
        className,
      )}
    >
      {paragraph}
    </p>
  );
}

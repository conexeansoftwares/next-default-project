import { cn } from '@/lib/utils';

interface IPageTitle {
  className?: string;
  text: string;
}

export function PageTitle({ className, text }: IPageTitle) {
  return (
    <h1 className={cn('text-lg font-semibold md:text-2xl', className)}>
      {text}
    </h1>
  );
}

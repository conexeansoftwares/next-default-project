import { cn } from '@/lib/utils';

interface ISidebarContentTitle {
  className?: string;
  text: string;
}

export function SidebarContentTitle({ className, text }: ISidebarContentTitle) {
  return (
    <h2
      className={cn(
        'mb-2 px-7 text-base font-semibold tracking-tight',
        className,
      )}
    >
      {text}
    </h2>
  );
}

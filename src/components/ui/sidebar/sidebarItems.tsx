import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SidebarItems {
  className?: string;
  children: ReactNode;
  href: string;
}

export function SidebarItems({ className, children, href }: SidebarItems) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:bg-secondary/80',
        className,
      )}
    >
      {children}
    </Link>
  );
}

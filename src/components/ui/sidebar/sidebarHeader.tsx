import Link from 'next/link';
import { ReactNode } from 'react';

interface ISidebarHeader {
  children: ReactNode;
}

export function SidebarHeader({ children }: ISidebarHeader) {
  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        {children}
      </Link>
    </div>
  );
}

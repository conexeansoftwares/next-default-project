'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MainLayout } from './_components/mainLayout';

export default function ClientMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  const pathname = usePathname();

  return (
    <MainLayout
      pathname={pathname}
    >
      {children}
    </MainLayout>
  );
}

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/usePermissions';
import { MainLayout } from './_components/mainLayout';

export default function ClientMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userPermissions } = useAuth();

  return (
    <MainLayout
      pathname={pathname}
      userPermissions={userPermissions}
    >
      {children}
    </MainLayout>
  );
}

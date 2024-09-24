import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navbar } from '../../../components/ui/navbar/navbar';
import { Sidebar } from '../../../components/ui/sidebar';
import {
  ShieldCheck,
  Building2,
  Car,
  Users,
  SquareStack,
  Footprints,
  Link,
  UsersRound,
} from 'lucide-react';

interface SidebarItem {
  permission: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
  pathname: string;
  userPermissions: string[];
}

export function MainLayout({
  children,
  pathname,
  userPermissions,
}: MainLayoutProps) {
  const checkPermission = (permission: string, action: string) => {
    return userPermissions.includes(`${permission}:${action}`);
  };

  const isActiveRoute = (path: string, href: string) => {
    return path === href;
  };

  const renderSidebarContent = (title: string, items: SidebarItem[]): React.ReactNode => {
    const hasAnyPermission = items.some(item => checkPermission(item.permission, 'READ'));

    if (!hasAnyPermission) {
      return null;
    }

    return (
      <Sidebar.Content>
        {title && <Sidebar.ContentTitle text={title} />}
        <Sidebar.Navigation>
          {items.map(item => (
            checkPermission(item.permission, 'READ') && (
              <Sidebar.Item
                key={item.href}
                href={item.href}
                active={isActiveRoute(pathname, item.href)}
              >
                {item.icon}
                {item.label}
              </Sidebar.Item>
            )
          ))}
        </Sidebar.Navigation>
      </Sidebar.Content>
    );
  };

  const shortcutsItems: SidebarItem[] = [
    { permission: 'shortcuts', href: '/shortcuts', icon: <Link className="w-4 h-4" />, label: 'Atalhos' },
    { permission: 'steps', href: '/steps', icon: <Footprints className="w-4 h-4" />, label: 'Passo a passo' },
  ];

  const cadastrosItems: SidebarItem[] = [
    { permission: 'companies', href: '/companies', icon: <Building2 className="w-4 h-4" />, label: 'Empresas' },
    { permission: 'employees', href: '/employees', icon: <Users className="w-4 h-4" />, label: 'Colaboradores' },
    { permission: 'vehicles', href: '/vehicles', icon: <Car className="w-4 h-4" />, label: 'Veículos' },
    { permission: 'users', href: '/users', icon: <UsersRound className="w-4 h-4" />, label: 'Usuários' },
  ];

  const portariaItems: SidebarItem[] = [
    { permission: 'movements', href: '/movements', icon: <ShieldCheck className="w-4 h-4" />, label: 'Movimentação' },
    { permission: 'historical', href: '/historical', icon: <SquareStack className="w-4 h-4" />, label: 'Histórico' },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar.Root>
          <Sidebar.Header>
            <ShieldCheck className="h-6 w-6" />
            <span>Supervisão Portaria</span>
          </Sidebar.Header>
          {renderSidebarContent('', shortcutsItems)}
          {renderSidebarContent('Cadastros', cadastrosItems)}
          {renderSidebarContent('Portaria', portariaItems)}
        </Sidebar.Root>
      </div>
      <div className="flex flex-col">
        <ScrollArea className="h-screen">
          <Navbar />
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}

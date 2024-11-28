import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navbar } from '@/components/ui/navbar/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import { ShieldCheck } from 'lucide-react';
import {
  SidebarItem,
  shortcutsItems,
  cadastrosItems,
  portariaItems,
} from '@/app/(main)/_components/sidebarItems';
import { useAuth } from '@/hooks/usePermissions';

interface MainLayoutProps {
  children: React.ReactNode;
  pathname: string;
}

export function MainLayout({
  children,
  pathname,
}: MainLayoutProps) {
  const { checkPermission } = useAuth();

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
          {items.map(item => {
            return (
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
  );})}
        </Sidebar.Navigation>
      </Sidebar.Content>
    );
  };

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

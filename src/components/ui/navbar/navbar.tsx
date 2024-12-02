import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/ui/sidebar';
import { ShieldCheck, Menu, CircleUser } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarItem,
  shortcutsItems,
  cadastrosItems,
  portariaItems,
} from '@/app/(main)/_components/sidebarItems';
import { logout } from '@/actions/auth/logout';

export function Navbar() {
  const pathname = usePathname();

  const isActiveRoute = (path: string, href: string) => {
    return path === href;
  };

  const renderNavItems = (items: SidebarItem[]): React.ReactNode => {
    return items.map((item) => (
      <Sidebar.Item
        key={item.href}
        href={item.href}
        active={isActiveRoute(pathname, item.href)}
      >
        {item.icon}
        {item.label}
      </Sidebar.Item>
    ));
  };

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[350px]">
          <SheetTitle>Menu de navegação</SheetTitle>
          <ScrollArea className="h-[calc(100vh-60px)] pb-10">
            <Sidebar.Root>
              <Sidebar.Header>
                <ShieldCheck className="h-6 w-6" />
                <span>Supervisão Portaria</span>
              </Sidebar.Header>
              <Sidebar.Content>
                <Sidebar.Navigation>
                  {renderNavItems(shortcutsItems)}
                </Sidebar.Navigation>
              </Sidebar.Content>
              <Sidebar.Content>
                <Sidebar.ContentTitle text="Cadastros" />
                <Sidebar.Navigation>
                  {renderNavItems(cadastrosItems)}
                </Sidebar.Navigation>
              </Sidebar.Content>
              <Sidebar.Content>
                <Sidebar.ContentTitle text="Portaria" />
                <Sidebar.Navigation>
                  {renderNavItems(portariaItems)}
                </Sidebar.Navigation>
              </Sidebar.Content>
            </Sidebar.Root>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <NextLink
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:hidden"
      >
        <ShieldCheck className="h-6 w-6" />
        <span>Supervisão Portaria</span>
      </NextLink>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action={logout}>
              <button type="submit" className="w-full text-left">
                Sair
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

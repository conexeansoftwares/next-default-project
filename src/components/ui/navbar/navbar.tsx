import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet';
import { Button } from '../button';
import { Building2, Car, CircleUser, Menu, Package2, Users } from 'lucide-react';
import Link from 'next/link';
import { Sidebar } from '../sidebar';
import { isActiveRoute } from '@/utils/isActiveRoute';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathName = usePathname();

  return (
    <header className="flex h-14 items-center justify-between md:justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetTitle>Menu de navegação</SheetTitle>
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span>Supervisão Portaria</span>
            </Link>
            <Sidebar.Item
              href="/companies"
              active={isActiveRoute(pathName, '/companies')}
            >
              <Building2 className="w-4 h-4" />
              Empresas
            </Sidebar.Item>

            <Sidebar.Item
              href="/contributors"
              active={isActiveRoute(pathName, '/contributors')}
            >
              <Users className="w-4 h-4" />
              Colaboradores
            </Sidebar.Item>

            <Sidebar.Item
              href="/vehicles"
              active={isActiveRoute(pathName, '/vehicles')}
            >
              <Car className="w-4 h-4" />
              Veículos
            </Sidebar.Item>
          </nav>
        </SheetContent>
      </Sheet>
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
          <DropdownMenuItem>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

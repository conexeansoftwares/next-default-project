'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Navbar } from '../../components/ui/navbar/navbar';
import { Sidebar } from '../../components/ui/sidebar';
import { isActiveRoute } from '../../utils/isActiveRoute';
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
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar.Root>
          <Sidebar.Header>
            <ShieldCheck className="h-6 w-6" />
            <span>Supervisão Portaria</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Navigation>
              <Sidebar.Item
                href="/shortcuts"
                active={isActiveRoute(pathname, '/shortcuts')}
              >
                <Link className="w-4 h-4" />
                Atalhos
              </Sidebar.Item>
              <Sidebar.Item
                href="/steps"
                active={isActiveRoute(pathname, '/steps')}
              >
                <Footprints className="w-4 h-4" />
                Passo a passo
              </Sidebar.Item>
            </Sidebar.Navigation>
          </Sidebar.Content>
          <Sidebar.Content>
            <Sidebar.ContentTitle text="Cadastros" />
            <Sidebar.Navigation>
              <Sidebar.Item
                href="/companies"
                active={isActiveRoute(pathname, '/companies')}
              >
                <Building2 className="w-4 h-4" />
                Empresas
              </Sidebar.Item>

              <Sidebar.Item
                href="/employees"
                active={isActiveRoute(pathname, '/employees')}
              >
                <Users className="w-4 h-4" />
                Colaboradores
              </Sidebar.Item>

              <Sidebar.Item
                href="/vehicles"
                active={isActiveRoute(pathname, '/vehicles')}
              >
                <Car className="w-4 h-4" />
                Veículos
              </Sidebar.Item>

              <Sidebar.Item href='/users' active={isActiveRoute(pathname, '/users')}>
                <UsersRound className="w-4 h-4" />
                Usuários
              </Sidebar.Item>
            </Sidebar.Navigation>
          </Sidebar.Content>

          <Sidebar.Content>
            <Sidebar.ContentTitle text="Portaria" />
            <Sidebar.Navigation>
              <Sidebar.Item
                href="/movement"
                active={isActiveRoute(pathname, '/movement')}
              >
                <ShieldCheck className="w-4 h-4" />
                Movimentação
              </Sidebar.Item>

              <Sidebar.Item
                href="/historical"
                active={isActiveRoute(pathname, '/historical')}
              >
                <SquareStack className="w-4 h-4" />
                Histórico
              </Sidebar.Item>
            </Sidebar.Navigation>
          </Sidebar.Content>

          {/* <Sidebar.Footer>
            <Sidebar.Navigation>
              <Sidebar.Item href='/configurations'>
                <Home className="w-4 h-4" />
                Configurações
              </Sidebar.Item>
            </Sidebar.Navigation>
          </Sidebar.Footer> */}
        </Sidebar.Root>
      </div>
      <div className="flex flex-col">
        <ScrollArea className='h-screen'>
          <Navbar />
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}

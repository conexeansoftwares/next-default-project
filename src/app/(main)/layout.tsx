import { Navbar } from '@/components/ui/navbar/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import {
  Home,
  ShieldCheck,
  UsersRound,
  Building2,
  Users,
  Car,
} from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar.Root>
          <Sidebar.Header>
            <ShieldCheck className="h-6 w-6" />
            <span className="">Supervisão Portaria</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.ContentTitle text="Cadastros" />
            <Sidebar.Navigation>
              <Sidebar.Item href='/companies'>
                <Building2 className="w-4 h-4" />
                Empresas
              </Sidebar.Item>

              <Sidebar.Item href='/contributors'>
                <Users className="w-4 h-4" />
                Colaboradores
              </Sidebar.Item>

              <Sidebar.Item href='/vehicles'>
                <Car className="w-4 h-4" />
                Veículos
              </Sidebar.Item>

              <Sidebar.Item href='/users'>
                <UsersRound className="w-4 h-4" />
                Usuários
              </Sidebar.Item>
            </Sidebar.Navigation>
          </Sidebar.Content>

          <Sidebar.Footer>
            <Sidebar.Navigation>
              <Sidebar.Item href='/configurations'>
                <Home className="w-4 h-4" />
                Configurações
              </Sidebar.Item>
            </Sidebar.Navigation>
          </Sidebar.Footer>
        </Sidebar.Root>
      </div>
      <div className="flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

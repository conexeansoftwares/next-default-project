import React from 'react';
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

export interface SidebarItem {
  permission: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}

export const shortcutsItems: SidebarItem[] = [
  {
    permission: 'shortcuts',
    href: '/shortcuts',
    icon: <Link className="w-4 h-4" />,
    label: 'Atalhos',
  },
  {
    permission: 'steps',
    href: '/steps',
    icon: <Footprints className="w-4 h-4" />,
    label: 'Passo a passo',
  },
];

export const cadastrosItems: SidebarItem[] = [
  {
    permission: 'companies',
    href: '/companies',
    icon: <Building2 className="w-4 h-4" />,
    label: 'Empresas',
  },
  {
    permission: 'employees',
    href: '/employees',
    icon: <Users className="w-4 h-4" />,
    label: 'Colaboradores',
  },
  {
    permission: 'vehicles',
    href: '/vehicles',
    icon: <Car className="w-4 h-4" />,
    label: 'Veículos',
  },
  {
    permission: 'users',
    href: '/users',
    icon: <UsersRound className="w-4 h-4" />,
    label: 'Usuários',
  },
];

export const portariaItems: SidebarItem[] = [
  {
    permission: 'movements',
    href: '/movements',
    icon: <ShieldCheck className="w-4 h-4" />,
    label: 'Movimentação',
  },
  {
    permission: 'historical',
    href: '/historical',
    icon: <SquareStack className="w-4 h-4" />,
    label: 'Histórico',
  },
];

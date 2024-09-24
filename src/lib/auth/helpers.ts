import { NextRequest } from 'next/server';
import { PUBLIC_ROUTES } from './constants';

type Permission = {
  module: string;
  permission: string;
};

export type UserPayload = {
  email: string;
  fullName: string;
  companyId: string;
  permissions: Permission[];
  exp: number;
  iat: number;
  nbf: number;
};

export function checkPermission(userPermissions: Permission[], requiredModule: string, requiredPermission: string): boolean {
  return userPermissions.some(p => p.module === requiredModule && p.permission === requiredPermission);
}

export function isPublicRoute(route: string): boolean {
  return PUBLIC_ROUTES.some(publicRoute => route.startsWith(publicRoute));
}

// Função para extrair o caminho da rota a partir da URL
export function getRoutePath(request: NextRequest): string {
  const url = new URL(request.url);
  return url.pathname;
}

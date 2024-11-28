import { auth } from '@/lib/auth';
import { Permission } from '@prisma/client';

type ServerAction<T = any> = (...args: any[]) => Promise<T>;

interface UserPayload {
  id: number;
  email: string;
  fullName: string;
  companyId: number;
  permissions: Array<{ module: string; permission: Permission }>;
}

export function withPermissions(
  requiredModule: string, 
  requiredPermission: Permission, 
  action: ServerAction
) {
  return async (...args: any[]) => {
    // // Obtém o token dos cookies do servidor
    // const token = auth.getSessionToken();

    // if (!token) {
    //   throw new Error('Token não fornecido');
    // }

    // const payload = await auth.verifyToken(token) as UserPayload | null;

    // if (!payload) {
    //   throw new Error('Token inválido');
    // }

    // const hasPermission = payload.permissions.some(
    //   p => p.module === requiredModule && p.permission === requiredPermission
    // );

    // if (!hasPermission) {
    //   throw new Error('Permissão negada');
    // }

    // Se a verificação de permissão passar, execute a action
    return action(...args);
  };
}
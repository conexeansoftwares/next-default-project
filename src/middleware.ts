import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { isPublicRoute, getRoutePath, UserPayload } from '@/lib/auth/helpers';

// interface RoutePermission {
//   module: string;
//   permission: Permission;
// }

// const routePermissions: { [key: string]: RoutePermission } = {
//   '/shortcuts': { module: 'shortcuts', permission: 'READ' },
//   '/shortcuts/create': { module: 'shortcuts', permission: 'WRITE' },
//   '/shortcuts/update/[shortcutId]': { module: 'shortcuts', permission: 'WRITE' },
//   '/steps': { module: 'steps', permission: 'READ' },
//   '/companies': { module: 'companies', permission: 'READ' },
//   '/companies/create': { module: 'companies', permission: 'WRITE' },
//   '/companies/update[companyId]': { module: 'companies', permission: 'WRITE' },
//   '/employees': { module: 'employees', permission: 'READ' },
//   '/employees/create': { module: 'employees', permission: 'WRITE' },
//   '/employees/update/[employeeId]': { module: 'employees', permission: 'WRITE' },
//   '/vehicles': { module: 'vehicles', permission: 'READ' },
//   '/vehicles/create': { module: 'vehicles', permission: 'WRITE' },
//   '/vehicles/update/[vehicleId]': { module: 'vehicles', permission: 'WRITE' },
//   '/users': { module: 'users', permission: 'READ' },
//   '/users/create': { module: 'users', permission: 'WRITE' },
//   '/users/update/[userId]': { module: 'users', permission: 'WRITE' },
//   '/movement': { module: 'movements', permission: 'READ' },
//   '/historical': { module: 'historical', permission: 'READ' },
// };

declare module 'next/server' {
  interface NextRequest {
    user?: UserPayload;
  }
}

// function matchRoute(route: string): RoutePermission | undefined {
//   // First, try to match the exact route
//   if (routePermissions[route]) {
//     return routePermissions[route];
//   }
//   // If no exact match, try to match dynamic routes
//   const routeParts = route.split('/');
//   for (const [key, value] of Object.entries(routePermissions)) {
//     const keyParts = key.split('/');
//     if (keyParts.length === routeParts.length) {
//       const match = keyParts.every((part, index) => {
//         if (part.startsWith('[') && part.endsWith(']')) {
//           // This is a dynamic segment, so it always matches
//           return true;
//         }
//         return part === routeParts[index];
//       });
//       if (match) {
//         return value;
//       }
//     }
//   }
//   return undefined;
// }

export async function middleware(request: NextRequest) {
  const route = getRoutePath(request);
  if (isPublicRoute(route)) {
    return NextResponse.next();
  }
  const token = request.cookies.get(auth.getTokenName())?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
  // try {
  //   const payload = await auth.verifyToken(token) as UserPayload;
  //   const requiredPermission = matchRoute(route);
  //   if (requiredPermission && !checkPermission(payload.permissions, requiredPermission.module, requiredPermission.permission)) {
  //     return NextResponse.redirect(new URL('/unauthorized', request.url));
  //   }
  //   // Clonar a solicitação e adicionar o usuário
  //   const requestWithUser = request.clone();
  //   (requestWithUser as any).user = payload;
  //   return NextResponse.next({
  //     request: requestWithUser,
  //   });
  // } catch (error) {
  //   return NextResponse.redirect(new URL('/auth', request.url));
  // }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
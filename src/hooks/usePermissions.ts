import { useState, useEffect, useCallback } from 'react';
import { jwtVerify } from 'jose';
import config from '@/config/env';
import { Permission } from '@prisma/client';

interface IPermission {
  module: string;
  permission: Permission;
}

interface UserData {
  email: string;
  fullName: string;
  companyId: string;
  permissions: IPermission[];
}

interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  loading: boolean;
  userPermissions: string[];
}

const SECRET_KEY = new TextEncoder().encode(config.jwtSecret);

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userData: null,
    loading: true,
    userPermissions: [],
  });

  useEffect(() => {
    const verifyToken = async () => {
      const token = getCookie(config.jwtTokenName);
      if (!token) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        const userData = payload as unknown as UserData;
        const userPermissions = userData.permissions.map(
          p => `${p.module}:${p.permission}`
        );
        setAuthState({
          isAuthenticated: true,
          userData,
          loading: false,
          userPermissions,
        });
      } catch (error) {
        console.error('Invalid token:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    verifyToken();
  }, []);

  const checkPermission = useCallback((module: string, requiredPermission: Permission) => {
    return authState.userPermissions.includes(`${module}:${requiredPermission}`);
  }, [authState.userPermissions]);

  return {
    ...authState,
    checkPermission,
  };
}

// Helper function to get a cookie value
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

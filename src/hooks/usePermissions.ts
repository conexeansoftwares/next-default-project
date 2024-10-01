import { useState, useEffect, useCallback } from 'react';
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

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: true,
    userData: {
      email: 'user@example.com',
      fullName: 'Example User',
      companyId: 'example-company-id',
      permissions: [],
    },
    loading: false,
    userPermissions: [],
  });

  useEffect(() => {
    // Simulate loading completion
    setAuthState(prev => ({ ...prev, loading: false }));
  }, []);

  const checkPermission = useCallback((_module: string, _requiredPermission: Permission) => {
    return true;
  }, []);

  return {
    ...authState,
    checkPermission,
  };
}

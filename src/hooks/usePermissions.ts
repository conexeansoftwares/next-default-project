import { useState, useEffect, useCallback } from 'react';
import { Permission as PrismaPermission } from '@prisma/client';
import { getUserPermissionsAction } from '@/actions/auth/getPermissions';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import config from '@/config/env';
import { jwtVerify } from 'jose';

export interface IUserPermission {
  module: string;
  permission: string;
}

const SECRET_KEY = new TextEncoder().encode(config.jwtSecret);

export function useAuth() {
  const [userPermissions, setUserPermissions] = useState<IUserPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = getCookie(config.jwtTokenName);
      if (!token) {
        setUserPermissions([]);
        setIsLoading(false);
        return;
      }

      const { payload } = await jwtVerify(token, SECRET_KEY);
      
      if (!payload) {
        setUserPermissions([]);
        setIsLoading(false);
        return;
      }

      const response = await getUserPermissionsAction(payload.id as number);
      if (response.success) {
        setUserPermissions(response.data || []);
      } else {
        setUserPermissions([]);
        throw new AppError(MESSAGE.COMMON.GENERIC_ERROR_MESSAGE, 500);
      }
    } catch (err) {
      setUserPermissions([]);
      throw new AppError(MESSAGE.COMMON.GENERIC_ERROR_MESSAGE, 500);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const checkPermission = useCallback((module: string, requiredPermission: PrismaPermission) => {
    return userPermissions.some(
      up => up.module === module && up.permission === requiredPermission
    );
  }, [userPermissions]);
  
  const clearPermissions = useCallback(() => {
    setUserPermissions([]);
  }, []);

  return {
    userPermissions,
    checkPermission,
    isLoading,
    // refreshPermissions: verifyToken,
    clearPermissions,
  };
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}
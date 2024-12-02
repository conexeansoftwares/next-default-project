import { useState, useEffect, useCallback } from 'react';
import { Permission as PrismaPermission } from '@prisma/client';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import config from '@/config/env';
import { jwtVerify } from 'jose';
import { IPermission } from '@/app/auth/types';
import { useLoading } from '@/context/loadingContext';

export interface IUserPermission {
  module: string;
  permission: string;
}

const SECRET_KEY = new TextEncoder().encode(config.jwtSecret);

export function useAuth() {
  const [userPermissions, setUserPermissions] = useState<IUserPermission[]>([]);
  const { setIsLoading } = useLoading();

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

      const permissions = payload.permissions as IPermission[];

      setUserPermissions(permissions);

    } catch (err) {
      setUserPermissions([]);
      throw new AppError(MESSAGE.COMMON.GENERIC_ERROR_MESSAGE, 500);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const checkPermission = useCallback((module: string, requiredPermission: PrismaPermission) => {
    return userPermissions.some(
      up => up.module === module && up.permission === requiredPermission
    );
  }, [userPermissions]);

  return {
    userPermissions,
    checkPermission,
  };
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}
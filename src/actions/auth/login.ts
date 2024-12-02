'use server';

import { IGetActiveUserLoginActionResult, IPermission } from '@/app/auth/types';
import { AppError } from '@/error/appError';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LoginFormData, loginFormSchema } from '@/schemas/loginSchema';
import { handleErrors } from '@/utils/handleErrors';
import { MESSAGE } from '@/utils/message';
import bcrypt from 'bcrypt';
import { PrismaClient, Prisma } from '@prisma/client';

export interface IPayload {
  email: string;
  id: number;
  fullName: string;
  companyId: number;
  permissions: IPermission[];
}

export async function loginUserAction(data: LoginFormData): Promise<IGetActiveUserLoginActionResult> {
  try {
    const validatedData = loginFormSchema.parse(data);
    const { email, password } = validatedData;

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.findUnique({
        where: {
          email,
          active: true,
        },
        select: {
          id: true,
          email: true,
          password: true,
          employee: {
            select: {
              fullName: true,
              companies: {
                select: {
                  companyId: true,
                },
              },
            },
          },
          userPermissions: {
            select: {
              module: true,
              permission: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError(MESSAGE.LOGIN.FAIL, 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new AppError(MESSAGE.LOGIN.FAIL, 401);
      }

      const userData: IPayload = {
        email: user.email,
        id: user.id,
        fullName: user.employee.fullName,
        companyId: user.employee.companies[0]?.companyId,
        permissions: user.userPermissions,
      };

      await auth.createTokenAndSetCookie(userData);

      return { email: userData.email, fullName: userData.fullName, permissions: user.userPermissions, message: MESSAGE.LOGIN.SUCCESS };
    });

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}
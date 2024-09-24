'use server';

import { GetActiveUserLoginActionResult } from '@/app/auth/types';
import { AppError } from '@/error/appError';
import { prisma } from '@/lib/prisma';
import { LoginFormData, loginFormSchema } from '@/schemas/loginSchema';
import { handleErrors } from '@/utils/handleErrors';
import { MESSAGE } from '@/utils/message';
import bcrypt from 'bcrypt';
import { auth } from '@/lib/auth'; 

export async function loginUserAction(data: LoginFormData): Promise<GetActiveUserLoginActionResult> {
  try {
    const validatedData = loginFormSchema.parse(data);
    const { email, password } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
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

      const userData = {
        email: user.email,
        fullName: user.employee.fullName,
        companyId: user.employee.companies[0]?.companyId,
        permissions: user.userPermissions,
      };

      const token = await auth.createTokenAndSetCookie(userData);

      return { email: userData.email, fullName: userData.fullName, token, permissions: userData.permissions, message: MESSAGE.LOGIN.SUCCESS };
    });

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

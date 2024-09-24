'use server';

import { AppError } from '@/error/appError';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

export interface IDeactiveEmployeeReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

const deactivateEmployeeSchema = z.string().cuid();

export const deactivateEmployeeAction = withPermissions(
  'employees',
  'DELETE',
  async (employeeId: string): Promise<IDeactiveEmployeeReturnProps> => {
    try {
      const validatedId = deactivateEmployeeSchema.parse(employeeId);

      const result = await prisma.$transaction(async (tx) => {
        const employee = await tx.employee.findUnique({
          where: { id: validatedId, active: true },
          include: {
            user: {
              where: { active: true },
              select: { id: true },
            },
          },
        });

        if (!employee) {
          throw new AppError(MESSAGE.EMPLOYEE.NOT_FOUND, 404);
        }

        const activeUser = employee.user;

        if (activeUser) {
          throw new AppError(MESSAGE.EMPLOYEE.EXISTING_DEPENDENCIES, 400);
        }

        await tx.employee.update({
          where: { id: validatedId },
          data: {
            active: false,
            deactivatedAt: new Date(),
          },
        });

        return MESSAGE.EMPLOYEE.DEACTIVATED_SUCCESS;
      });

      revalidatePath('/employees');
      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

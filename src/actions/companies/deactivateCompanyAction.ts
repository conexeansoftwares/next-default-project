'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';

export interface IDeactiveCompanyReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const deactivateCompanyAction = withPermissions(
  'companies',
  'DELETE',
  async (companyId: number): Promise<IDeactiveCompanyReturnProps> => {
    try {
      const validatedId = idSchema.parse(companyId);

      const result = await prisma.$transaction(async (tx) => {
        const company = await tx.company.findUnique({
          where: { id: validatedId, active: true },
          include: {
            vehicles: {
              where: { active: true },
              select: { id: true },
            },
            employees: {
              where: { employee: { active: true } },
              select: {
                employee: {
                  select: {
                    id: true,
                    user: {
                      where: { active: true },
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        });

        if (!company) {
          throw new AppError(MESSAGE.COMPANY.NOT_FOUND, 404);
        }

        const activeVehicles = company.vehicles.length;
        const activeEmployees = company.employees.length;
        const activeUsers = company.employees.reduce(
          (sum, empl) => sum + (empl.employee.user ? 1 : 0),
          0,
        );

        if (activeVehicles > 0 || activeEmployees > 0 || activeUsers > 0) {
          throw new AppError(MESSAGE.COMPANY.EXISTING_DEPENDENCIES, 400);
        }

        await tx.company.update({
          where: { id: validatedId },
          data: {
            active: false,
            deactivatedAt: new Date(),
          },
        });

        return MESSAGE.COMPANY.DEACTIVATED_SUCCESS;
      });

      revalidatePath('/companies');

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

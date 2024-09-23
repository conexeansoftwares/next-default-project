'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultCompanyActionResult } from '@/app/(main)/companies/types';

const deactivateCompanySchema = z.string().cuid();

export async function deactivateCompanyAction(companyId: string): Promise<DefaultCompanyActionResult> {
  try {
    const validatedId = deactivateCompanySchema.parse(companyId);

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
      const activeUsers = company.employees.reduce((sum, empl) => 
        sum + (empl.employee.user ? 1 : 0), 0);

      if (activeVehicles > 0 || activeEmployees > 0 || activeUsers > 0) {
        const error = 'Não é possível desativar a empresa devido a veículo(s), colaborador(es) e/ou usuário(s) vinculados. Desative essas entidades antes de desativar a empresa.';      
        throw new AppError(error, 400);
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

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

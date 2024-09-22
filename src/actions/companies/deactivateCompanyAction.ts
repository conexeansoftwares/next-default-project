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
          contributors: {
            where: { contributor: { active: true } },
            select: { 
              contributor: {
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
      const activeContributors = company.contributors.length;
      const activeUsers = company.contributors.reduce((sum, contrib) => 
        sum + (contrib.contributor.user ? 1 : 0), 0);

      if (activeVehicles > 0 || activeContributors > 0 || activeUsers > 0) {
        let error = 'Não é possível desativar a empresa devido a:';
        if (activeVehicles > 0) error += `\n- ${activeVehicles} veículo(s) ativo(s)`;
        if (activeContributors > 0) error += `\n- ${activeContributors} colaborador(es) ativo(s)`;
        if (activeUsers > 0) error += `\n- ${activeUsers} usuário(s) ativo(s)`;
        error += '\nPor favor, desative estas entidades antes de desativar a empresa.';
        
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

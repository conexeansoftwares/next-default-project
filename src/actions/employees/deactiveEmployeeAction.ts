'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultEmployeeActionResult } from '@/app/(main)/employees/types';

const deactivateEmployeeSchema = z.string().cuid();

export async function deactivateEmployeeAction(
  employeeId: string,
): Promise<DefaultEmployeeActionResult> {
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
        let error = 'Não é possível desativar o colaborador devido a:';
        error += '\n- 1 usuário ativo';
        error +=
          '\nPor favor, desative o usuário antes de desativar o colaborador.';

        throw new AppError(error, 400);
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

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

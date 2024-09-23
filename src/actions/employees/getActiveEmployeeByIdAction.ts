'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetActiveEmployeeActionResult, IEmployeeToEdit } from '@/app/(main)/employees/types';

const getEmployeeSchema = z.string().cuid();

export async function getActiveEmployeeByIdAction(
  employeeId: string
): Promise<GetActiveEmployeeActionResult> {
  try {
    const validatedId = getEmployeeSchema.parse(employeeId);
    
    const result = await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({
        where: {
          id: validatedId,
          active: true,
        },
        include: {
          companies: {
            select: {
              companyId: true,
            },
          },
        },
      });

      if (!employee) {
        throw new AppError(MESSAGE.EMPLOYEE.NOT_FOUND, 404);
      }

      const formattedEmployee: IEmployeeToEdit = {
        id: employee.id,
        fullName: employee.fullName,
        registration: employee.registration,
        internalPassword: employee.internalPassword,
        telephone: employee.telephone,
        cellPhone: employee.cellPhone,
        observation: employee.observation,
        photoURL: employee.photoURL,
        companyIds: employee.companies.map((company) => company.companyId),
      };

      return formattedEmployee;
    });

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

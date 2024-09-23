'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { GetAllActiveEmployeesActionResult } from '@/app/(main)/employees/types';

type EmployeeFields = {
  id?: boolean;
  fullName?: boolean;
  registration?: boolean;
  internalPassword?: boolean;
  telephone?: boolean;
  cellPhone?: boolean;
  observation?: boolean;
  photoURL?: boolean;
  companies?: boolean;
};

export async function getAllActiveEmployeesAction(
  fields: EmployeeFields = { id: true, fullName: true },
  forSelect = false
): Promise<GetAllActiveEmployeesActionResult> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const employees = await tx.employee.findMany({
        select: forSelect
          ? { id: true, fullName: true }
          : {
              ...fields,
              companies: fields.companies 
                ? {
                    select: {
                      company: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  }
                : undefined,
            },
        where: { active: true },
      });

      if (employees.length === 0) {
        throw new AppError(MESSAGE.EMPLOYEE.ALL_NOT_FOUND, 404);
      }

      return employees;
    });

    revalidatePath('/employees');

    return { success: true, data: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

'use server';

import { prisma } from '../../lib/prisma';
import { removeTelephoneMask } from '@/utils/telephoneUtils';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { DefaultEmployeeActionResult } from '@/app/(main)/employees/types';
import { EmployeeFormData, employeeFormSchema } from '@/schemas/employeeSchema';

export async function createEmployeeAction(
  data: EmployeeFormData
): Promise<DefaultEmployeeActionResult> {
  try {
    const validatedData = employeeFormSchema.parse(data);

    const {
      fullName,
      registration,
      internalPassword,
      telephone,
      cellPhone,
      observation,
      photoURL,
      companyIds,
    } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
      const existingEmployee = await tx.employee.findUnique({
        where: { registration },
      });

      if (existingEmployee) {
        throw new AppError(MESSAGE.EMPLOYEE.EXISTING_REGISTRATION, 409);
      }

      await tx.employee.create({
        data: {
          fullName,
          registration,
          internalPassword,
          telephone: telephone ? removeTelephoneMask(telephone) : null,
          cellPhone: cellPhone ? removeTelephoneMask(cellPhone) : null,
          observation,
          photoURL,
          companies: {
            create: companyIds.map((companyId) => ({
              company: { connect: { id: companyId } },
            })),
          },
        },
      });

      return MESSAGE.EMPLOYEE.CREATED_SUCCESS;
    });

    revalidatePath('/employees');

    return { success: true, message: result };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

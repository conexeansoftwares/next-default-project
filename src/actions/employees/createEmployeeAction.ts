'use server';

import { AppError } from '@/error/appError';
import { prisma } from '../../lib/prisma';
import { EmployeeFormData, employeeFormSchema } from '@/schemas/employeeSchema';
import { removeTelephoneMask } from '@/utils/telephoneUtils';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { Prisma } from '@prisma/client';

export interface ICreateEmployeeReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const createEmployeeAction = withPermissions(
  'employees',
  'READ',
  async (data: EmployeeFormData): Promise<ICreateEmployeeReturnProps> => {
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

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

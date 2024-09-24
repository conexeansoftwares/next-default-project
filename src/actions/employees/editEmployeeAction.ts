'use server';

import { AppError } from '@/error/appError';
import { prisma } from '../../lib/prisma';
import {
  EmployeeFormData,
  employeeFormSchema,
} from '../../schemas/employeeSchema';
import { removeTelephoneMask } from '@/utils/telephoneUtils';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';

interface EditEmployeeActionParams {
  employeeId: string;
  data: EmployeeFormData;
}

export interface IEditEmployeeReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const editEmployeeAction = withPermissions(
  'employees',
  'WRITE',
  async (params: EditEmployeeActionParams): Promise<IEditEmployeeReturnProps> => {
    try {
      const { employeeId, data } = params;
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
          where: { id: employeeId },
          include: { companies: true },
        });

        if (!existingEmployee) {
          throw new AppError(MESSAGE.EMPLOYEE.NOT_FOUND, 404);
        }

        const employeeWithSameRegistration = await tx.employee.findFirst({
          where: {
            registration,
            companies: {
              some: {
                companyId: { in: companyIds },
              },
            },
            id: { not: employeeId },
          },
        });

        if (employeeWithSameRegistration) {
          throw new AppError(MESSAGE.EMPLOYEE.EXISTING_REGISTRATION, 400);
        }

        await tx.employee.update({
          where: { id: employeeId },
          data: {
            fullName,
            registration,
            internalPassword,
            telephone: telephone ? removeTelephoneMask(telephone) : null,
            cellPhone: cellPhone ? removeTelephoneMask(cellPhone) : null,
            observation,
            photoURL,
            companies: {
              deleteMany: {
                employeeId,
              },
              create: companyIds.map((companyId) => ({
                company: { connect: { id: companyId } },
              })),
            },
          },
        });

        return MESSAGE.EMPLOYEE.UPDATED_SUCCESS;
      });

      revalidatePath('/employees');
      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

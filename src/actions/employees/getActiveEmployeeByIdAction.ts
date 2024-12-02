'use server';

import { AppError } from '@/error/appError';
import { prisma } from '../../lib/prisma';
import { MESSAGE } from '@/utils/message';
import { IEmployeeToEdit } from '@/app/(main)/employees/types';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';
import { Prisma } from '@prisma/client';

export interface IGetActiveEmployeeReturnProps {
  success: boolean,
  data?: IEmployeeToEdit;
  error?: string;
}

export const getActiveEmployeeByIdAction = withPermissions(
  'employees',
  'READ',
  async (employeeId: number): Promise<IGetActiveEmployeeReturnProps> => {
    try {
      const validatedId = idSchema.parse(employeeId);

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
  },
);

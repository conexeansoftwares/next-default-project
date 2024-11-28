'use server';

import { AppError } from '@/error/appError';
import { prisma } from '../../lib/prisma';
import { MESSAGE } from '@/utils/message';
import { ICompany } from '@/app/(main)/companies/types';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { idSchema } from '@/schemas/idSchema';

export interface IGetActiveCompanyByIdReturnProps {
  success: boolean;
  data?: ICompany;
  error?: string;
}

export const getActiveCompanyByIdAction = withPermissions(
  'companies',
  'READ',
  async (companyId: number): Promise<IGetActiveCompanyByIdReturnProps> => {
    try {
      const validatedId = idSchema.parse(companyId);

      const result = await prisma.$transaction(async (tx) => {
        const company = await tx.company.findUnique({
          select: {
            id: true,
            name: true,
            cnpj: true,
          },
          where: {
            id: validatedId,
            active: true,
          },
        });

        if (!company) {
          throw new AppError(MESSAGE.COMPANY.NOT_FOUND, 404);
        }

        return company;
      });

      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

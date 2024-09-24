'use server';

import { AppError } from '@/error/appError';
import { prisma } from '../../lib/prisma';
import {
  CompanyFormData,
  companyFormSchema,
  idCompanySchema,
} from '../../schemas/companySchema';
import { removeCnpjMask } from '../../utils/cnpjUtils';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { handleErrors } from '@/utils/handleErrors';
import { z } from 'zod';

interface EditCompanyActionParams {
  companyId: string;
  data: CompanyFormData;
}

export interface IEditCompanyReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const editCompanyAction = withPermissions(
  'companies',
  'WRITE',
  async (params: EditCompanyActionParams): Promise<IEditCompanyReturnProps> => {
    try {

      const { companyId, data } = params;

      const validatedId = idCompanySchema.parse(companyId);
      const validatedData = companyFormSchema.parse(data);

      const { name, cnpj } = validatedData;

      const cleanCnpj = removeCnpjMask(cnpj);

      const result = await prisma.$transaction(async (tx) => {
        const existingCompany = await tx.company.findUnique({
          where: { id: validatedId },
        });

        if (!existingCompany) {
          throw new AppError(MESSAGE.COMPANY.NOT_FOUND, 404);
        }

        const companyWithSameCnpj = await tx.company.findFirst({
          where: {
            cnpj: cleanCnpj,
            id: { not: validatedId },
          },
        });

        if (companyWithSameCnpj) {
          throw new AppError(MESSAGE.COMPANY.EXISTING_CNPJ, 409);
        }

        await tx.company.update({
          where: { id: companyId },
          data: {
            name,
            cnpj: cleanCnpj,
          },
        });

        return MESSAGE.COMPANY.UPDATED_SUCCESS;
      });

      revalidatePath('/companies');
      return { success: true, data: result };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

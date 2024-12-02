'use server';

import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { removeCpfMask } from '@/utils/cpfUtils';
import { removeTelephoneMask } from '@/utils/telephoneUtils';
import { handleErrors } from '@/utils/handleErrors';
import {
  VisitorMovementFormData,
  visitorMovementFormSchema,
} from '@/schemas/visitorMovementSchema';
import { withPermissions } from '@/middleware/serverActionAuthorizationMiddleware';
import { Prisma } from '@prisma/client';

export interface ICreateVehicleMovementReturnProps {
  success: boolean;
  data?: string;
  error?: string;
}

export const createVisitorMovementAction = withPermissions(
  'movements',
  'WRITE',
  async (data: VisitorMovementFormData): Promise<ICreateVehicleMovementReturnProps> => {
    try {
      const validatedData = visitorMovementFormSchema.parse(data);

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const visitorMovement = await tx.visitorMovement.create({
          data: {
            fullName: validatedData.fullName,
            cpf: validatedData.cpf
              ? removeCpfMask(validatedData.cpf)
              : undefined,
            telephone: validatedData.telephone
              ? removeTelephoneMask(validatedData.telephone)
              : undefined,
            licensePlate: validatedData.licensePlate,
            observation: validatedData.observation,
            action: validatedData.action,
            companies: {
              create: validatedData.companyIds.map((companyId) => ({
                company: { connect: { id: companyId } },
              })),
            },
          },
        });

        return visitorMovement;
      });

      revalidatePath('/contributors');

      return { success: true, data: MESSAGE.VISITOR_MOVEMENT.CREATED_SUCCESS };
    } catch (error) {
      const errorResult = handleErrors(error);
      return { success: false, error: errorResult.error };
    }
  },
);

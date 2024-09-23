'use server';

import { Action } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { MESSAGE } from '@/utils/message';
import { handleErrors } from '@/utils/handleErrors';
import { removeCpfMask } from '@/utils/cpfUtils';
import { removeTelephoneMask } from '@/utils/telephoneUtils';
import { VisitorMovementFormData, visitorMovementFormSchema } from '@/schemas/visitorMovementSchema';
import { DefaultActionResult } from '@/app/(main)/movement/types';

export async function createVisitorMovementAction(
  data: VisitorMovementFormData
): Promise<DefaultActionResult> {
  try {
    const validatedData = visitorMovementFormSchema.parse(data);

    await prisma.$transaction(async (tx) => {
      const visitorMovement = await tx.visitorMovement.create({
        data: {
          fullName: validatedData.fullName,
          cpf: validatedData.cpf ? removeCpfMask(validatedData.cpf) : undefined,
          telephone: validatedData.telephone ? removeTelephoneMask(validatedData.telephone) : undefined,
          licensePlate: validatedData.licensePlate,
          action: validatedData.action as Action,
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

    return {
      success: true,
      message: MESSAGE.VISITOR_MOVEMENT.CREATED_SUCCESS,
    };
  } catch (error) {
    const errorResult = handleErrors(error);
    return { success: false, error: errorResult.error };
  }
}

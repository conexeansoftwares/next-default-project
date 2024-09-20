'use server';

import { prisma } from '@/lib/prisma';
import {
  VisitorMovementFormData,
  visitorMovementFormSchema,
} from '@/schemas/visitorMovementSchema';
import { removeCpfMask } from '@/utils/cpfUtils';
import { removeTelephoneMask } from '@/utils/telephoneUtils';
import { Action } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function createVisitorMovementAction(
  data: VisitorMovementFormData,
) {
  try {
    const { fullName, cpf, telephone, licensePlate, companyIds, action } = visitorMovementFormSchema.parse(data);
    
    const visitorMovement = await prisma.visitorMovement.create({
      data: {
        fullName,
        cpf: removeCpfMask(cpf as string),
        telephone: removeTelephoneMask(telephone),
        licensePlate,
        action: action as Action,
        companies: {
          create: companyIds.map((companyId) => ({
            company: { connect: { id: companyId } },
          })),
        },
      },
    });

    revalidatePath('/contributors');

    return {
      success: true,
      message: 'Movimentação criada com sucesso',
      data: visitorMovement,
    };
  } catch (error) {
    console.error('Error in createVisitorMovementAction:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: 'Ocorreu um erro ao criar movimentação',
    };
  }
}

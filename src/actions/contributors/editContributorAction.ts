'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  ContributorFormData,
  contributorFormSchema,
} from '../../schemas/contributorSchema';
import { z } from 'zod';
import { removeTelephoneMask } from '@/utils/telephoneUtils';

export async function editContributorAction(
  contributorId: string,
  data: ContributorFormData,
) {
  try {
    const {
      name,
      lastName,
      registration,
      internalPassword,
      telephone,
      cellPhone,
      observation,
      photoURL,
      companyIds,
    } = contributorFormSchema.parse(data);

    await prisma.contributor.update({
      where: { id: contributorId },
      data: {
        name,
        lastName,
        registration,
        internalPassword,
        telephone: removeTelephoneMask(telephone as string),
        cellPhone: removeTelephoneMask(cellPhone as string),
        observation,
        photoURL,
        companies: {
          deleteMany: {},
          create: companyIds.map((companyId) => ({
            company: { connect: { id: companyId } },
          })),
        },
      },
    });

    revalidatePath('/contributors');

    return { success: true, message: 'Colaborador atualizado com sucesso' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return {
      success: false,
      message: 'Ocorreu um erro ao atualizar o colaborador',
    };
  }
}

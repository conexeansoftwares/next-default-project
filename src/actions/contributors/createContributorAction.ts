'use server';

import { removeTelephoneMask } from '@/utils/telephoneUtils';
import { prisma } from '../../lib/prisma';
import {
  ContributorFormData,
  contributorFormSchema,
} from '../../schemas/contributorSchema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function createContributorAction(data: ContributorFormData) {
  console.log(data);
  try {
    const {
      fullName,
      registration,
      internalPassword,
      telephone,
      cellPhone,
      observation,
      photoURL,
      companyIds,
    } = contributorFormSchema.parse(data);

    const contributor = await prisma.contributor.create({
      data: {
        fullName,
        registration,
        internalPassword,
        telephone: removeTelephoneMask(telephone as string),
        cellPhone: removeTelephoneMask(cellPhone as string),
        observation,
        photoURL,
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
      message: 'Colaborador criado com sucesso',
      contributorId: contributor.id,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return {
      success: false,
      message: 'Ocorreu um erro ao criar o colaborador',
    };
  }
}

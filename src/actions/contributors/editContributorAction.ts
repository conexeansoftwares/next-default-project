'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  ContributorFormData,
  contributorFormSchema,
} from '../../schemas/contributorSchema';
import { z } from 'zod';

export async function editContributorAction(
  contributorId: string,
  data: ContributorFormData,
) {
  try {
    const validatedData = contributorFormSchema.parse(data);

    const {
      name,
      lastName,
      registration,
      internalPassword,
      telephone,
      observation,
      photoURL,
      companyIds,
    } = validatedData;

    await prisma.contributor.update({
      where: { id: contributorId },
      data: {
        name,
        lastName,
        registration,
        internalPassword,
        telephone,
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

'use server';

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

    const contributor = await prisma.contributor.create({
      data: {
        name,
        lastName,
        registration,
        internalPassword,
        telephone,
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
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return {
      success: false,
      message: 'Ocorreu um erro ao criar o colaborador',
    };
  }
}

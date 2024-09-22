'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import {
  IContributorReturnProps,
  IContributorWithCompanies,
  IContributorToEdit,
} from '../../app/(main)/contributors/types';

const getContributorSchema = z.string().cuid();

export async function getActiveContributorByIdAction(
  contributorId: string
): Promise<IContributorReturnProps> {
  try {
    const validatedId = getContributorSchema.parse(contributorId);

    const contributor = await prisma.contributor.findUnique({
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

    if (!contributor) {
      return {
        success: false,
        data: null,
        message: 'Colaborador não encontrado ou inativo',
      };
    }

    const contributorWithCompanies = contributor as IContributorWithCompanies;

    const formattedContributor: IContributorToEdit = {
      id: contributorWithCompanies.id,
      fullName: contributorWithCompanies.fullName,
      registration: contributorWithCompanies.registration,
      internalPassword: contributorWithCompanies.internalPassword,
      telephone: contributorWithCompanies.telephone,
      cellPhone: contributorWithCompanies.cellPhone,
      observation: contributorWithCompanies.observation,
      photoURL: contributorWithCompanies.photoURL,
      companyIds: contributorWithCompanies.companies.map((company) => company.companyId),
    };

    return { success: true, data: formattedContributor };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        message: 'ID do colaborador inválido',
      };
    }
    console.error('Erro ao buscar colaborador:', error);
    return {
      success: false,
      data: null,
      message: 'Ocorreu um erro ao buscar o colaborador',
    };
  }
}

'use server';

import { IContributor, IContributorsReturnProps } from '../../app/(main)/contributors/types';
import { prisma } from '../../lib/prisma';

export async function getAllActiveContributors(): Promise<IContributorsReturnProps> {
  try {
    const contributors: IContributor[] = await prisma.contributor.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        registration: true,
        internalPassword: true,
        telephone: true,
        observation: true,
        photoURL: true,
      },
      where: { active: true },
    });

    return { success: true, data: contributors };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: 'Ocorreu um erro ao listar os colaboradores',
    };
  }
}

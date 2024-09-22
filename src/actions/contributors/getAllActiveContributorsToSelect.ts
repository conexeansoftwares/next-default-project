'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { IContributorsReturnToSelectProps, IContributorToSelect } from '@/app/(main)/contributors/types';

export async function getAllActiveContributorsToSelect(): Promise<IContributorsReturnToSelectProps> {
  try {
    const contributors: IContributorToSelect[] = await prisma.contributor.findMany({
      select: {
        id: true,
        fullName: true,
      },
      where: { active: true },
    });

    revalidatePath('/contributors');

    return { success: true, data: contributors };
  } catch (error) {
    return { success: false, data: [], message: 'Ocorreu um erro ao listar colaboradores.' };
  }
}

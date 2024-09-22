'use server';

import { prisma } from '../../lib/prisma';
import { Permission } from '@prisma/client';

interface IUser {
  id: string;
  email: string;
  contributorId: string;
  userPermissions: {
    module: string;
    permission: Permission;
  }[];
}

interface IUsersReturnProps {
  success: boolean;
  data: IUser[] | null;
  message?: string;
}

export async function getAllActiveUsersAction(): Promise<IUsersReturnProps> {
  try {
    const users: IUser[] = await prisma.user.findMany({
      where: { active: true },
      select: {
        id: true,
        email: true,
        contributorId: true,
        userPermissions: {
          select: {
            module: true,
            permission: true,
          },
        },
      },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return {
      success: false,
      data: [],
      message: 'Ocorreu um erro ao listar os usuários',
    };
  }
}

'use server';

import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { Permission } from '@prisma/client';

const getUserSchema = z.string().cuid();

interface IUserPermission {
  module: string;
  permission: Permission;
}

interface IUserToEdit {
  id: string;
  email: string;
  contributorId: string | null;
  userPermissions: IUserPermission[];
}

interface IUserReturnProps {
  success: boolean;
  data: IUserToEdit | null;
  message?: string;
}

export async function getActiveUserByIdAction(userId: string): Promise<IUserReturnProps> {
  try {
    const validatedId = getUserSchema.parse(userId);

    const user = await prisma.user.findUnique({
      where: {
        id: validatedId,
      },
      include: {
        userPermissions: {
          select: {
            module: true,
            permission: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        data: null,
        message: 'Usuário não encontrado',
      };
    }

    const formattedUser: IUserToEdit = {
      id: user.id,
      email: user.email,
      contributorId: user.contributorId,
      userPermissions: user.userPermissions.map((perm) => ({
        module: perm.module,
        permission: perm.permission,
      })),
    };

    return { success: true, data: formattedUser };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        message: 'ID do usuário inválido',
      };
    }
    console.error('Erro ao buscar usuário:', error);
    return {
      success: false,
      data: null,
      message: 'Ocorreu um erro ao buscar o usuário',
    };
  }
}

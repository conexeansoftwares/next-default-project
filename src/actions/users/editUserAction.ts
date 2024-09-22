// src/actions/users/editUserAction.ts

'use server';

import { prisma } from '@/lib/prisma';
import { UserFormData } from '@/schemas/userSchema';
import { Permission } from '@prisma/client';

export async function editUserAction(userId: string, data: UserFormData) {
  try {
    const { email, contributorId, permissions } = data;

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        contributorId,
      },
    });

    // Delete existing permissions
    await prisma.userPermission.deleteMany({
      where: { userId },
    });

    // Create new permissions
    const newPermissions = Object.entries(permissions).flatMap(([module, modulePermissions]) =>
      Object.entries(modulePermissions)
        .filter(([, isGranted]) => isGranted)
        .map(([permission]) => ({
          userId,
          module,
          permission: permission as Permission,
        }))
    );

    await prisma.userPermission.createMany({
      data: newPermissions,
    });

    return { success: true, message: 'Usuário atualizado com sucesso.' };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return { success: false, message: 'Ocorreu um erro ao atualizar o usuário.' };
  }
}

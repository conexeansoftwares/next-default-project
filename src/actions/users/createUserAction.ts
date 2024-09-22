'use server';

import { prisma } from '../../lib/prisma';
import { UserFormData, userFormSchema } from '../../schemas/userSchema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Permission } from '@prisma/client';

const permissionMapping = {
  'Ler': Permission.READ,
  'Escrever': Permission.WRITE,
  'Deletar': Permission.DELETE,
  'Admin': Permission.ADMIN,
};

export async function createUserAction(data: UserFormData) {
  try {
    const validatedData = userFormSchema.parse(data);

    const { email, password, contributorId, permissions } = validatedData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        contributorId,
      },
    });

    const userPermissions = [];

    for (const [moduleId, modulePermissions] of Object.entries(permissions)) {
      for (const [permission, isGranted] of Object.entries(modulePermissions)) {
        if (isGranted) {
          const mappedPermission = permissionMapping[permission as keyof typeof permissionMapping];
          if (mappedPermission) {
            userPermissions.push({
              userId: user.id,
              module: moduleId,
              permission: mappedPermission,
            });
          }
        }
      }
    }

    await prisma.userPermission.createMany({
      data: userPermissions,
      skipDuplicates: true,
    });

    revalidatePath('/users');

    return { success: true, message: 'Usuário criado com sucesso' };
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'Ocorreu um erro ao criar o usuário' };
  }
}

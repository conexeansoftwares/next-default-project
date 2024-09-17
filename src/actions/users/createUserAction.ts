'use server';

import { UserFormData } from '../../schemas/userSchema';

export async function createUserAction(data: UserFormData) {
  console.log(data);
}

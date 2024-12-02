'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export async function logout() {
  cookies().delete(auth.getTokenName());

  redirect('/auth');
}
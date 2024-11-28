import { z } from 'zod';
import { AppError } from '@/error/appError';
import { MESSAGE } from '@/utils/message';

type ErrorResult = {
  errors?: z.ZodError['errors'];
  error: string;
};

export function handleErrors(error: any): ErrorResult {
  if (error instanceof z.ZodError) {
    return {
      errors: error.errors,
      error: error.errors.map((e) => e.message).join(', '),
    };
  }
  if (error instanceof AppError) {
    return { error: error.message };
  }
  return { error: error.message };
}

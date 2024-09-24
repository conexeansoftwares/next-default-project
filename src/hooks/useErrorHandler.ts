import { useState, useCallback } from 'react';
import { useToast } from './useToast';
import { MESSAGE } from '@/utils/message';
import { z } from 'zod';
import { AppError } from '@/error/appError';

type ErrorResult = {
  errors?: z.ZodError['errors'];
  error: string;
};

function handleErrors(error: unknown): ErrorResult {
  if (error instanceof z.ZodError) {
    return {
      errors: error.errors,
      error: error.errors.map((e) => e.message).join(', '),
    };
  }
  if (error instanceof AppError) {
    return { error: error.message };
  }
  if (error instanceof Error) {
    return { error: error.message };
  }
  return { error: MESSAGE.COMMON.GENERIC_ERROR_MESSAGE };
}

export function useErrorHandler() {
  const { toast } = useToast();
  const [error, setError] = useState<ErrorResult | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      const errorResult = handleErrors(err);
      setError(errorResult);

      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: errorResult.error,
      });

      // Se houver erros de validação Zod, você pode querer fazer algo específico com eles aqui
      if (errorResult.errors) {
        console.log('Validation errors:', errorResult.errors);
        // Você pode adicionar lógica adicional para lidar com erros de validação
      }
    },
    [toast]
  );

  return { error, handleError };
}

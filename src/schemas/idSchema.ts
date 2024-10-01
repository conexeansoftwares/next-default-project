import { z } from 'zod';

export const idSchema = z
  .number({
    required_error: 'O ID é obrigatório',
    invalid_type_error: 'O ID deve ser um número',
  })
  .int({
    message: 'O ID deve ser um número inteiro',
  })
  .positive({
    message: 'O ID deve ser um número positivo',
  })
  .finite({
    message: 'O ID deve ser um número finito',
  });

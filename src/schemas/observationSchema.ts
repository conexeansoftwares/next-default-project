import { z } from 'zod';

export const observationSchema = z
.string()
.max(200, { message: 'Observação não pode exceder 200 caracteres' })
.optional();

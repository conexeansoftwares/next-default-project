import * as z from 'zod';

export const colorOptions = [
  { value: 'bg-red-500', color: '#ef4444' },
  { value: 'bg-blue-500', color: '#3b82f6' },
  { value: 'bg-green-500', color: '#22c55e' },
  { value: 'bg-yellow-500', color: '#eab308' },
  { value: 'bg-purple-500', color: '#a855f7' },
  { value: 'bg-pink-500', color: '#ec4899' },
  { value: 'bg-indigo-500', color: '#6366f1' },
  { value: 'bg-gray-500', color: '#6b7280' },
  { value: 'bg-background', color: 'bg-bakground' },
] as const;

export type ColorValue = typeof colorOptions[number]['value'];

const ColorEnum = z.enum(colorOptions.map(option => option.value) as [string, ...string[]]);

export const shortcutFormSchema = z.object({
  url: z
    .string()
    .min(2, { message: 'Url deve conter pelo menos 2 caracteres' })
    .max(200, { message: 'Url não pode exceder 200 caracteres' }),
  label: z
    .string()
    .min(2, { message: 'Label deve conter pelo menos 2 caracteres' })
    .max(50, { message: 'Label não pode exceder 50 caracteres' }),
  color: ColorEnum,
});

export type ShortcutFormData = z.infer<typeof shortcutFormSchema>;

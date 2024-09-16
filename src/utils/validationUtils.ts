export type ValidationRule = (value: any) => string | null;

export type ValidationField = ValidationRule[];

export type Validations = {
  [key: string]: ValidationField;
};

export const required = (fieldName: string): ValidationRule => 
  (value: any) => value !== undefined && value !== null && value !== '' ? null : `${fieldName} é obrigatório`;

export const minLength = (min: number, fieldName: string): ValidationRule => 
  (value: string) => value.length >= min ? null : `${fieldName} deve ter pelo menos ${min} caracteres`;

export const maxLength = (max: number, fieldName: string): ValidationRule => 
  (value: string) => value.length <= max ? null : `${fieldName} deve ter no máximo ${max} caracteres`;

export const pattern = (regex: RegExp, message: string): ValidationRule => 
  (value: string) => regex.test(value) ? null : message;

export const validateField = (value: any, validations: ValidationField): string | null => {
  for (const validation of validations) {
    const result = validation(value);
    if (result !== null) {
      return result;
    }
  }
  return null;
};

export const validateFields = (
  schemaValidation: Validations,
  formData: FormData
): { field: string; message: string }[] => {
  const errors: { field: string; message: string }[] = [];

  Object.entries(schemaValidation).forEach(([field, validations]) => {
    const value = formData.get(field);
    const error = validateField(value, validations);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return errors;
};

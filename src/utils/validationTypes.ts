/**
 * Regra de validação para comprimento mínimo de string.
 * @param min Comprimento mínimo
 * @param fieldName Nome do campo para a mensagem de erro
 */
export const minLength = (min: number, fieldName: string): ValidationRule<string> => 
  (value: string) => value.length >= min || `${fieldName} deve ter pelo menos ${min} caracteres`;

/**
 * Regra de validação para comprimento máximo de string.
 * @param max Comprimento máximo
 * @param fieldName Nome do campo para a mensagem de erro
 */
export const maxLength = (max: number, fieldName: string): ValidationRule<string> => 
  (value: string) => value.length <= max || `${fieldName} deve ter no máximo ${max} caracteres`;

/**
 * Regra de validação para padrão de string (regex).
 * @param regex Expressão regular para validação
 * @param message Mensagem de erro personalizada
 */
export const pattern = (regex: RegExp, message: string): ValidationRule<string> => 
  (value: string) => regex.test(value) || message;

export type FieldValidation<T> = {
  [K in keyof T]: ValidationRule<T[K]>[];
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export type ValidationRule<T> = (value: T) => string | true;

export type FieldConfig<T> = {
  name: string;
  label: string;
  initialValue: T;
  validations: ValidationRule<T>[];
};

export type FormFieldConfig = 
  | FieldConfig<string>
  | FieldConfig<string[]>;

export type FormConfig = FormFieldConfig[];


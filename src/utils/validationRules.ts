import { ValidationRule } from './validationTypes';

/**
 * Regra de validação para campos obrigatórios.
 * @param fieldName Nome do campo para a mensagem de erro
 * @returns Função de validação que verifica se o campo não está vazio
 */
export const required = (fieldName: string): ValidationRule<unknown> => 
  (value: unknown) => value !== undefined && value !== null && value !== '' || `${fieldName} é obrigatório`;

/**
 * Regra de validação para comprimento mínimo de string.
 * @param min Comprimento mínimo
 * @param fieldName Nome do campo para a mensagem de erro
 * @returns Função de validação que verifica o comprimento mínimo
 */
export const minLength = (min: number, fieldName: string): ValidationRule<string> => 
  (value: string) => value.length >= min || `${fieldName} deve ter pelo menos ${min} caracteres`;

/**
 * Regra de validação para comprimento máximo de string.
 * @param max Comprimento máximo
 * @param fieldName Nome do campo para a mensagem de erro
 * @returns Função de validação que verifica o comprimento máximo
 */
export const maxLength = (max: number, fieldName: string): ValidationRule<string> => 
  (value: string) => value.length <= max || `${fieldName} deve ter no máximo ${max} caracteres`;

/**
 * Regra de validação para padrão de string (regex).
 * @param regex Expressão regular para validação
 * @param message Mensagem de erro personalizada
 * @returns Função de validação que verifica se a string corresponde ao padrão
 */
export const pattern = (regex: RegExp, message: string): ValidationRule<string> => 
  (value: string) => regex.test(value) || message;

/**
 * Remove todos os caracteres não numéricos de uma string.
 * @param value String a ser limpa
 * @returns String contendo apenas caracteres numéricos
 */
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

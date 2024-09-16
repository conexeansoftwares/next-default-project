export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}

export function removeCnpjMask(value: string): string {
  return value.replace(/[^\d]+/g, '');
}

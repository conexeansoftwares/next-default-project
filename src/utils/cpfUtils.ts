export function removeCpfMask(cpf: string): string {
  return cpf.replace(/[^\d]+/g, '');
}

export function formatCPF(cpf: string): string {
  const cleanCPF = removeCpfMask(cpf);
  return cleanCPF.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
}

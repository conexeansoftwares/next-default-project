export const modules = [
  {
    id: 'shortcuts',
    name: 'Atalhos',
    permissions: ['Ler', 'Escrever', 'Deletar'],
  },
  {
    id: 'steps',
    name: 'Passo a passo',
    permissions: ['Ler'],
  },
  {
    id: 'users',
    name: 'Usuários',
    permissions: ['Ler', 'Escrever', 'Deletar', 'Admin'],
  },
  {
    id: 'companies',
    name: 'Empresas',
    permissions: ['Ler', 'Escrever', 'Deletar', 'Admin'],
  },
  {
    id: 'vehicles',
    name: 'Veículos',
    permissions: ['Ler', 'Escrever', 'Deletar', 'Admin'],
  },
  {
    id: 'employees',
    name: 'Colaboradores',
    permissions: ['Ler', 'Escrever', 'Deletar', 'Admin'],
  },
  {
    id: 'movements',
    name: 'Movimentações',
    permissions: ['Ler', 'Escrever', 'Deletar', 'Admin'],
  },
  {
    id: 'historical',
    name: 'Histórico',
    permissions: ['Ler', 'Admin'],
  },

];

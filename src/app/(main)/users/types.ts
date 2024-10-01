// src/app/(main)/users/types.ts

export type Permission = 'Ler' | 'Escrever' | 'Deletar' | 'Admin';

export interface IUserPermission {
  module: string;
  permission: Permission;
}

export interface IUser {
  id: number;
  email: string;
  employeeId: number;
  userPermissions: IUserPermission[];
}

export interface IUserWithCompanies extends IUser {
  companies: { companyId: number }[];
}

export interface IUserToEdit {
  id: number;
  email: string;
  employeeId: number;
  userPermissions: IUserPermission[];
  companyIds: number[];
}

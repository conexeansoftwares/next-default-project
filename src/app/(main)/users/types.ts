// src/app/(main)/users/types.ts

export type Permission = 'Ler' | 'Escrever' | 'Deletar' | 'Admin';

export interface IUserPermission {
  module: string;
  permission: Permission;
}

export interface IUser {
  id: string;
  email: string;
  employeeId: string;
  userPermissions: IUserPermission[];
}

export interface IUserWithCompanies extends IUser {
  companies: { companyId: string }[];
}

export interface IUserToEdit {
  id: string;
  email: string;
  employeeId: string;
  userPermissions: IUserPermission[];
  companyIds: string[];
}

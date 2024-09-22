// src/app/(main)/users/types.ts

export type Permission = 'Ler' | 'Escrever' | 'Deletar' | 'Admin';

export interface IUserPermission {
  module: string;
  permission: Permission;
}

export interface IUser {
  id: string;
  email: string;
  contributorId: string;
  userPermissions: {
    module: string;
    permission: Permission;
  }[];
}

// If IUserToEdit is different from IUser, you might want to create a separate interface or type alias
export type IUserToEdit = IUser;


export interface IUserReturnProps {
  success: boolean;
  data: IUserToEdit | null;
  message?: string;
}

export interface IContributorToSelect {
  id: string;
  fullName: string;
}

export interface IUsersReturnProps {
  success: boolean;
  data: IUser[] | null;
  message?: string;
}

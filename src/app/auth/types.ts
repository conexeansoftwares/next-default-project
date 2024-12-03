export interface IPermission {
  module: string;
  permission: string;
}

export interface IuserLoginInformations {
  email: string;
  fullName: string;
  message: string;
  permissions: IPermission[];
}

export interface IGetActiveUserLoginActionResult {
  success: boolean;
  data?: IuserLoginInformations;
  message?: string;
  error?: string;
}

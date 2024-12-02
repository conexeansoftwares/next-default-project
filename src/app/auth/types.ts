export interface IPermission {
  module: string;
  permission: string;
}

export interface IuserLoginInformations {
  email: string;
  fullName: string;
  message: string;
  permissions: IPermission[]
}

export type DefaultLoginActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type IGetActiveUserLoginActionResult =
  | (Omit<Extract<DefaultLoginActionResult, { success: true }>, 'message'> & {
      data: IuserLoginInformations;
    })
  | Extract<DefaultLoginActionResult, { success: false }>;

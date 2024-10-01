export interface IuserLoginInformations {
  email: string;
  fullName: string;
  token: string;
  message: string;
  permissions: {
    module: string,
    permission: string,
  }[]
}

export type DefaultLoginActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type IGetActiveUserLoginActionResult =
  | (Omit<Extract<DefaultLoginActionResult, { success: true }>, 'message'> & {
      data: IuserLoginInformations;
    })
  | Extract<DefaultLoginActionResult, { success: false }>;

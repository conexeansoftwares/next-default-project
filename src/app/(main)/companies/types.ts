export interface ICompany {
  id: string;
  name: string;
  cnpj: string;
}

export interface ICompanySelect {
  id: string;
  name: string;
}

export type DefaultCompanyActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type GetActiveCompanyActionResult =
  | (Omit<Extract<DefaultCompanyActionResult, { success: true }>, 'message'> & {
      data: ICompany;
    })
  | Extract<DefaultCompanyActionResult, { success: false }>;

export type GetAllActiveCompanyActionResult =
  | (Omit<Extract<DefaultCompanyActionResult, { success: true }>, 'message'> & {
      data: ICompany[] | ICompanySelect[];
    })
  | Extract<DefaultCompanyActionResult, { success: false }>;

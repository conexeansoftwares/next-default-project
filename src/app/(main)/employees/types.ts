import { ICompany } from '../companies/types';

export interface IEmployee {
  id: string;
  fullName: string;
  registration: string;
  internalPassword: string | null;
  telephone: string | null;
  cellPhone: string | null;
  observation: string | null;
  photoURL: string | null;
}

export interface IEmployeeWithCompanies extends IEmployee {
  companies: {
    company: ICompany;
  }[];
}

export interface IEmployeeToEdit {
  id: string;
  fullName: string;
  registration: string;
  internalPassword: string | null;
  telephone: string | null;
  cellPhone: string | null;
  observation: string | null;
  photoURL: string | null;
  companyIds: string[];
}

export interface IEmployeeToSelect {
  id: string;
  fullName: string;
}

export type DefaultEmployeeActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type GetActiveEmployeeActionResult =
  | (Omit<
      Extract<DefaultEmployeeActionResult, { success: true }>,
      'message'
    > & {
      data: IEmployeeToEdit;
    })
  | Extract<DefaultEmployeeActionResult, { success: false }>;

export type GetAllActiveEmployeesActionResult =
  | (Omit<
      Extract<DefaultEmployeeActionResult, { success: true }>,
      'message'
    > & {
      data: IEmployee[] | IEmployeeToSelect[];
    })
  | Extract<DefaultEmployeeActionResult, { success: false }>;

export interface ICompanyData {
  name: string;
  anpj: string;
};

export interface ICompany {
  id: string;
  name: string;
  cnpj: string;
};

export interface ICompaniesReturnProps {
  success: boolean;
  data: ICompany[];
  message?: string;
}

export interface ICompanyReturnProps {
  success: boolean;
  data: ICompany | null;
  message?: string;
}

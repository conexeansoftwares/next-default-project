export interface IContributorData {
  id: string;
  name: string;
  lastname?: string;
  registration: string;
  internalPassword?: string;
  telephone?: string;
  cellPhone?: string;
  observation?: string;
  photoURL?: string;
}

export interface IContributor {
  id: string;
  name: string;
  lastName: string | null;
  registration: string;
  internalPassword: string | null;
  telephone: string | null;
  cellPhone: string | null;
  observation: string | null;
  photoURL: string | null;
}

export interface IContributorWithCompanies extends IContributor {
  companies: { companyId: string }[];
}

export interface IContributorToEdit {
  id: string;
  name: string;
  lastName: string | null;
  registration: string;
  internalPassword: string | null;
  telephone: string | null;
  cellPhone: string | null;
  observation: string | null;
  photoURL: string | null;
  companyIds: string[];
}

export interface IContributorsReturnProps {
  success: boolean;
  data: IContributor[];
  message?: string;
}

export interface IContributorReturnProps {
  success: boolean;
  data: IContributorToEdit | null;
  message?: string;
}

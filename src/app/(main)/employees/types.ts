export interface IEmployeeDataTable {
  id: string;
  fullName: string;
  registration: string;
  companies: {
    company: {
      id: string;
      name: string;
    };
  }[];
}

export interface IEmployeeToMovement {
  id: string;
  fullName: string;
  registration: string;
  observation: string | null;
  photoURL: string | null;
}

export interface IEmployeeToSelect {
  id: string;
  fullName: string;
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

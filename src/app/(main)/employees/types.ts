export interface IEmployeeDataTable {
  id: number;
  fullName: string;
  registration: string;
  companies: {
    company: {
      id: number;
      name: string;
    };
  }[];
}

export interface IEmployeeToMovement {
  id: number;
  fullName: string;
  registration: string;
  observation: string | null;
  photoURL: string | null;
}

export interface IEmployeeToSelect {
  id: number;
  fullName: string;
}

export interface IEmployeeToEdit {
  id: number;
  fullName: string;
  registration: string;
  internalPassword: string | null;
  telephone: string | null;
  cellPhone: string | null;
  observation: string | null;
  photoURL: string | null;
  companyIds: number[];
}

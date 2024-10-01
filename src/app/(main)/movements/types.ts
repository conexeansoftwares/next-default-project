// Tipos comuns
type Action = 'E' | 'S';

interface BaseMovement {
  id: number;
  action: Action;
  createdAt: Date;
}

// Tipos para Funcionários
export interface IEmployee {
  id: number;
  fullName: string;
  registration: string;
}

export interface IEmployeeMovement extends BaseMovement {
  employeeId: number;
  employee: IEmployee;
}

export interface IEmployeeMovementSelect {
  id: number;
  employeeId: number;
  action: Action;
}

export interface IEmployeeMovementDetail {
  fullName: string;
  registration: string;
  observation: string | null;
  action: Action;
  date: string;
}

// Tipos para Visitantes
export interface IVisitorMovementSimplified {
  fullName: string;
  cpf: string | null;
  telephone: string | null;
  licensePlate: string | null;
  observation: string | null;
  companies: { company: { name: string; }; }[]
  action: Action;
  date: string;
}

export interface IVisitorMovementSelect {
  id: number;
  fullName: string;
  action: Action;
}

// Tipos para Veículos
export interface IVehicle {
  id: number;
  licensePlate: string;
  carModel: string;
  company: {
    name: string;
  };
}

export interface IVehicleMovement extends BaseMovement {
  vehicleId: number;
  vehicle: IVehicle;
}

export interface IVehicleMovementDetail {
  licensePlate: string;
  carModel: string;
  companyName: string;
  observation: string | null;
  action: Action;
  date: string;
}

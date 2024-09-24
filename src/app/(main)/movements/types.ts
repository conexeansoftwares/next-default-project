// Tipos comuns
type Action = 'E' | 'S';

interface BaseMovement {
  id: string;
  action: Action;
  createdAt: Date;
}

// Tipos para Funcionários
export interface IEmployee {
  id: string;
  fullName: string;
  registration: string;
}

export interface IEmployeeMovement extends BaseMovement {
  employeeId: string;
  employee: IEmployee;
}

export interface IEmployeeMovementSelect {
  id: string;
  employeeId: string;
  action: Action;
}

export interface IEmployeeMovementDetail {
  name: string;
  lastName: string;
  registration: string;
  action: Action;
  date: string;
}

// Tipos para Visitantes
export interface IVisitorMovementSimplified {
  fullName: string;
  cpf: string | null;
  telephone: string | null;
  licensePlate: string | null;
  action: Action;
  date: string;
}

export interface IVisitorMovement extends BaseMovement, Omit<IVisitorMovementSimplified, 'date'> {
  companies: { id: string; name: string }[];
}

export interface IVisitorMovementSelect {
  id: string;
  fullName: string;
  action: Action;
}

// Tipos para Veículos
export interface IVehicle {
  id: string;
  licensePlate: string;
  carModel: string;
  company: {
    name: string;
  };
}

export interface IVehicleMovement extends BaseMovement {
  vehicleId: string;
  vehicle: IVehicle;
}

export interface IVehicleMovementDetail {
  licensePlate: string;
  carModel: string;
  companyName: string;
  action: Action;
  date: string;
}

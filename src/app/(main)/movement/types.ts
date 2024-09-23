// Tipos comuns
type Action = 'E' | 'S';

interface BaseMovement {
  id: string;
  action: Action;
  createdAt: Date;
}

export type DefaultActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

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

export type GetEmployeeMovementsByDateActionResult =
  | (Omit<Extract<DefaultActionResult, { success: true }>, 'message'> & {
      data: IEmployeeMovementDetail[];
    })
  | Extract<DefaultActionResult, { success: false }>;

export type GetEmployeeMovementActionResult =
  | (Omit<Extract<DefaultActionResult, { success: true }>, 'message'> & {
      data: IEmployeeMovement;
    })
  | Extract<DefaultActionResult, { success: false }>;

export type GetAllEmployeeMovementsActionResult =
  | (Omit<Extract<DefaultActionResult, { success: true }>, 'message'> & {
      data: IEmployeeMovement[] | IEmployeeMovementSelect[];
    })
  | Extract<DefaultActionResult, { success: false }>;

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

export type GetVisitorMovementsByDateActionResult =
  | { success: true; data: IVisitorMovementSimplified[] }
  | { success: false; error: string };

export type GetVisitorMovementActionResult =
  | (Omit<Extract<DefaultActionResult, { success: true }>, 'message'> & {
      data: IVisitorMovement;
    })
  | Extract<DefaultActionResult, { success: false }>;

export type GetAllVisitorMovementsActionResult =
  | (Omit<Extract<DefaultActionResult, { success: true }>, 'message'> & {
      data: IVisitorMovement[] | IVisitorMovementSelect[];
    })
  | Extract<DefaultActionResult, { success: false }>;

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

export type GetVehicleMovementActionResult =
  | (Omit<Extract<DefaultActionResult, { success: true }>, 'message'> & {
      data: IVehicleMovementDetail[];
    })
  | Extract<DefaultActionResult, { success: false }>;

export type GetAllVehicleMovementsActionResult =
  | (Omit<Extract<DefaultActionResult, { success: true }>, 'message'> & {
      data: IVehicleMovement[];
    })
  | Extract<DefaultActionResult, { success: false }>;

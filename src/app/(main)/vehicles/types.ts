export interface IVehicleData {
  licensePlate: string;
  owner: string;
  carModel: string;
  companyId: string;
}

export interface IVehicle {
  id: string;
  licensePlate: string;
  owner: string;
  carModel: string;
  companyId: string;
  companyName: string;
}

export interface IVehicleSelect {
  id: string;
  licensePlate: string;
  owner: string;
}

export type DefaultVehicleActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type GetVehicleActionResult =
  | (Omit<Extract<DefaultVehicleActionResult, { success: true }>, 'message'> & {
      data: IVehicle;
    })
  | Extract<DefaultVehicleActionResult, { success: false }>;

export type GetAllVehiclesActionResult =
  | (Omit<Extract<DefaultVehicleActionResult, { success: true }>, 'message'> & {
      data: IVehicle[] | IVehicleSelect[];
    })
  | Extract<DefaultVehicleActionResult, { success: false }>;


  

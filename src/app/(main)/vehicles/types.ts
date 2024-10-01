export interface IVehicleData {
  licensePlate: string;
  owner: string;
  carModel: string;
  companyId: number;
}

export interface IVehicle {
  id: number;
  licensePlate: string;
  owner: string | null;
  carModel: string;
  companyId: number;
  companyName: string;
}

export interface IVehicleSelect {
  id: number;
  licensePlate: string;
  owner: string;
}
  

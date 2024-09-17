export interface IVehicleData {
  licensePlate: string;
  year: string;
  carModel: string;
  companyId: string;
};

export interface IVehicle {
  id: string;
  licensePlate: string;
  year: string;
  carModel: string;
  companyId: string;
  companyName: string;
};

export interface IVehicleToEdit {
  id: string;
  licensePlate: string;
  year: string;
  carModel: string;
  companyId: string;
};

export interface IVehiclesReturnProps {
  success: boolean;
  data: IVehicle[];
  message?: string;
}

export interface IVehicleReturnProps {
  success: boolean;
  data: IVehicleToEdit | null;
  message?: string;
}

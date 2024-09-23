'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createVehicleMovementAction } from '@/actions/movements/vehicles/createVehicleMovementAction';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getActiveVehicleByLicensePlateAction } from '@/actions/vehicles/getActiveVehicleByLicensePlateAction';
import { MESSAGE } from '@/utils/message';

interface IVehicleToMovement {
  id: string;
  licensePlate: string;
  carModel: string;
  owner: string;
  companyName?: string;
}

export function VehicleMovementForm() {
  const { toast } = useToast();
  const [requesting, setRequesting] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<IVehicleToMovement | null>(null);
  const [licensePlate, setLicensePlate] = useState('');
  const [action, setAction] = useState<'E' | 'S'>('E');

  const searchVehicle = async () => {
    if (licensePlate === '') {
      toast({
        variant: 'warning',
        title: MESSAGE.MOVEMENT.REQUIRED_INFORMATIONS_TITLE,
        description: MESSAGE.MOVEMENT.LICENSE_PLATE_REQUIRED,
      });

      return;
    }

    setRequesting(true);
    const response = await getActiveVehicleByLicensePlateAction(licensePlate);

    if (response.success) {
      setVehicle(response.data);
      setLicensePlate('');
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: response.error,
      });
    }

    setRequesting(false);
  };

  const registerMovement = async () => {
    if (!vehicle || !vehicle.id) {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: MESSAGE.VEHICLE.NOT_FOUND,
      });
      return;
    }

    setRequesting(true);
    const response = await createVehicleMovementAction(vehicle.id, action);

    if (response.success) {
      toast({
        variant: 'success',
        description: response.message,
      });
      setVehicle(null);
      setAction('E');
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: response.error,
      });
    }

    setRequesting(false);
  };

  const cancelRequest = () => {
    setVehicle(null);
    setLicensePlate('');
    setAction('E');
  };

  return (
    <div className="w-full">
      {!vehicle ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Placa do veículo</Label>
            <Input
              id="licensePlate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.toUpperCase())}
              maxLength={7}
              placeholder="Informe a placa do veículo"
            />
            <p className="text-sm text-muted-foreground">
              Informe somente números e letras da placa do veículo. Ex: AAA1111.
            </p>
          </div>
          <Button
            onClick={searchVehicle}
            disabled={requesting}
            className="w-full"
          >
            {requesting ? 'Buscando...' : 'Buscar veículo'}
          </Button>
        </div>
      ) : (
        <div className="bg-secondary/90 rounded-lg p-4 w-full">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary">
              Informações do veículo
            </h3>
            <p className="text-sm text-muted-foreground">
              Verifique as informações e registre a movimentação
            </p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Placa
                </h4>
                <p className="text-base font-medium">{vehicle.licensePlate}</p>
              </div>
              <div className="bg-background rounded-lg p-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Modelo
                </h4>
                <p className="text-base font-medium">{vehicle.carModel}</p>
              </div>
              <div className="bg-background rounded-lg p-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Dono
                </h4>
                <p className="text-base font-medium">{vehicle.owner}</p>
              </div>
              <div className="bg-background rounded-lg p-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Empresa
                </h4>
                <p className="text-base font-medium">
                  {vehicle.companyName || 'N/A'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Selecione a ação da movimentação
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={action === 'E' ? 'success' : 'outline'}
                  onClick={() => setAction('E')}
                >
                  Entrada
                </Button>
                <Button
                  type="button"
                  variant={action === 'S' ? 'destructive' : 'outline'}
                  onClick={() => setAction('S')}
                >
                  Saída
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={registerMovement}
                disabled={requesting}
                className="w-full"
              >
                {requesting ? 'Registrando...' : 'Registrar movimentação'}
              </Button>
              <Button
                onClick={cancelRequest}
                variant="warning"
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

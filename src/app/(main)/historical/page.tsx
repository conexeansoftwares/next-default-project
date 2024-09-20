'use client';

import React, { useState } from 'react';
import { PageComponent } from '@/components/ui/page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Car, User, UserPlus } from 'lucide-react';
import { VehicleHistorical } from './_components/vehicles/vehiclesHistorical';
import { ContributorHistorical } from './_components/contributors/contributorHistorical';
import { VisitorHistorical } from './_components/visitors/visitorHistorical';

type HistoricaType = 'veiculo' | 'colaborador' | 'visitante';

export default function Page() {
  const [tipoMovimentacao, setTipoMovimentacao] =
    useState<HistoricaType>('veiculo');

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Histórico de movimentação" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col space-y-6">
        <div>
          <label
            htmlFor="tipoMovimentacao"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tipo de Movimentação
          </label>
          <Select
            value={tipoMovimentacao}
            onValueChange={(value: HistoricaType) => setTipoMovimentacao(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="veiculo">
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4" />
                  Veículo
                </div>
              </SelectItem>
              <SelectItem value="colaborador">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Colaborador
                </div>
              </SelectItem>
              <SelectItem value="visitante">
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Visitante
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {tipoMovimentacao === 'veiculo' && <VehicleHistorical />}
        {tipoMovimentacao === 'colaborador' && <ContributorHistorical />}
        {tipoMovimentacao === 'visitante' && <VisitorHistorical />}
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

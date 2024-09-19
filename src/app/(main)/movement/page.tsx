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
import { VehicleMovementForm } from './_components/vehiclesMovementForm';
import { ContributorMovementForm } from './_components/contributorsMovementForm';
import { VisitorsMovementForm } from './_components/visitorsMovementForm';

type TipoMovimentacao = 'veiculo' | 'colaborador' | 'visitante';

export default function MovimentacaoPortariaPage() {
  const [tipoMovimentacao, setTipoMovimentacao] = useState<TipoMovimentacao>('veiculo');

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Movimentação de portaria" />
      </PageComponent.Header>
      <PageComponent.Content className="flex-col space-y-6">
        <div>
          <label htmlFor="tipoMovimentacao" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Movimentação
          </label>
          <Select value={tipoMovimentacao} onValueChange={(value: TipoMovimentacao) => setTipoMovimentacao(value)}>
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

        {tipoMovimentacao === 'veiculo' && <VehicleMovementForm />}
        {tipoMovimentacao === 'colaborador' && <ContributorMovementForm />}
        {tipoMovimentacao === 'visitante' && <VisitorsMovementForm />}
      </PageComponent.Content>
    </PageComponent.Root>
  );
}

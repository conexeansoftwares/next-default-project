import React, { useState } from 'react';
import { format, differenceInDays, addDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getColumns, IVehicleMovement } from './columns';
import { DataTable } from '@/components/ui/dataTable';
import {
  getVehicleMovementByDateAction,
  IGetVehicleMovementByDateReturnProps,
} from '@/actions/movements/vehicles/getVehicleMovementByDateAction';
import { MESSAGE } from '@/utils/message';
import { useToast } from '@/hooks/useToast';

const MAX_DATE_RANGE = 30;

export function VehicleHistorical() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [movements, setMovements] = useState<IVehicleMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleExpand = (rowId: string) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const columns = getColumns({ onExpand: handleExpand, expandedRows });

  const renderExpanded = (row: IVehicleMovement) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:hidden">
        <h4 className="font-semibold">Modelo</h4>
        <p>{row.carModel}</p>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        <h4 className="font-semibold">Empresa</h4>
        <p>{row.companyName}</p>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        <h4 className="font-semibold">Ação</h4>
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold w-auto ${
            row.action === 'E'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.action === 'E' ? 'Entrada' : 'Saída'}
        </span>
      </div>

      <div className="flex flex-col gap-2 xl:hidden">
        <h4 className="font-semibold">Data</h4>
        <p>{row.date}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-semibold">Observação</h4>
        <p>{row.observation || 'Sem observação'}</p>
      </div>
    </div>
  );

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && endDate && differenceInDays(endDate, date) > MAX_DATE_RANGE) {
      setEndDate(addDays(date, MAX_DATE_RANGE));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && startDate) {
      if (differenceInDays(date, startDate) > MAX_DATE_RANGE) {
        toast({
          variant: 'warning',
          title: MESSAGE.HISTORICAL.LIMIT_INTERVAL_TITLE,
          description: MESSAGE.HISTORICAL.LIMIT_INTERVAL,
        });
        return;
      }
    }
    setEndDate(date);
  };

  const handleGenerateHistorical = async () => {
    if (!startDate || !endDate) {
      toast({
        variant: 'destructive',
        title: MESSAGE.MOVEMENT.REQUIRED_INFORMATIONS_TITLE,
        description: MESSAGE.HISTORICAL.DATES_REQUIRED,
      });
      return;
    }

    if (differenceInDays(endDate, startDate) > MAX_DATE_RANGE) {
      toast({
        variant: 'warning',
        title: MESSAGE.HISTORICAL.LIMIT_INTERVAL_TITLE,
        description: MESSAGE.HISTORICAL.LIMIT_INTERVAL,
      });
      return;
    }

    setIsLoading(true);

    const result: IGetVehicleMovementByDateReturnProps =
      await getVehicleMovementByDateAction({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

    if (result.success && result.data) {
      setMovements(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: result.error,
      });
      setMovements([]);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <Popover>
            <PopoverTrigger asChild>
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Data inicial
                </label>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, 'PPP', { locale: pt })
                  ) : (
                    <span>Selecione a data inicial</span>
                  )}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
                locale={pt}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="col-span-1">
          <Popover>
            <PopoverTrigger asChild>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Data final
                </label>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, 'PPP', { locale: pt })
                  ) : (
                    <span>Selecione a data final</span>
                  )}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                locale={pt}
                disabled={(date) =>
                  startDate
                    ? differenceInDays(date, startDate) > MAX_DATE_RANGE
                    : false
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-sm text-muted-foreground">
          {MESSAGE.HISTORICAL.LIMIT_INTERVAL}
        </p>
        <Button
          className="col-span-full"
          onClick={handleGenerateHistorical}
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Gerar histórico'}
        </Button>
      </div>

      {movements.length > 0 && (
        <DataTable.Root columns={columns} data={movements}>
          <DataTable.Tools
            searchKey="licensePlate"
            searchPlaceholder="Filtrar por placa..."
          />
          <DataTable.Content
            columns={columns}
            expandable={true}
            renderExpanded={renderExpanded}
            expandedRows={expandedRows}
            onExpand={handleExpand}
          />
          <DataTable.Pagination />
        </DataTable.Root>
      )}
    </div>
  );
}

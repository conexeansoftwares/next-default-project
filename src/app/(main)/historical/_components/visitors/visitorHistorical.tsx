import React, { useState } from 'react';
import { format } from 'date-fns';
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
import { getColumns } from './columns';
import { DataTable } from '@/components/ui/dataTable';
import {
  getVisitorMovementByDateAction,
  IGetVisitorMovementByDate,
} from '@/actions/movements/visitors/getVisitorMovementByDateAction';
import { MESSAGE } from '@/utils/message';
import { useToast } from '@/hooks/useToast';
import { IVisitorMovementSimplified } from '@/app/(main)/movements/types';

export function VisitorHistorical() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [movements, setMovements] = useState<IVisitorMovementSimplified[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const columns = getColumns();

  const handleGenerateHistorical = async () => {
    if (!startDate || !endDate) {
      toast({
        variant: 'destructive',
        title: MESSAGE.MOVEMENT.REQUIRED_INFORMATIONS_TITLE,
        description: MESSAGE.HISTORICAL.DATES_REQUIRED,
      });
      return;
    }

    setIsLoading(true);

    const result: IGetVisitorMovementByDate = await getVisitorMovementByDateAction({
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
      <div className="grid grid-cols-2 gap-4">
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
                onSelect={setStartDate}
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
                onSelect={setEndDate}
                initialFocus
                locale={pt}
              />
            </PopoverContent>
          </Popover>
        </div>
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
            searchKey="fullName"
            searchPlaceholder="Filtrar por nome..."
          />
          <DataTable.Content columns={columns} />
          <DataTable.Pagination />
        </DataTable.Root>
      )}
    </div>
  );
}

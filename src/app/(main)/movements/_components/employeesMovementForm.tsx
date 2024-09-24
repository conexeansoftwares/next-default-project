'use client';

import React, { useState, useEffect } from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

import { UserIcon } from 'lucide-react';
import Image from 'next/image';
import { MESSAGE } from '@/utils/message';
import { createEmployeeMovementAction, ICreateEmployeeMovementReturnProps } from '@/actions/movements/employees/createEmployeeMovementAction';
import { getAllActiveEmployeesToMovementAction, IGetAllACtiveEmplyeesToMovementReturnProps } from '@/actions/employees/getAllActiveEmployeeToMovement';
import { IEmployeeToMovement } from '../../employees/types';

export function EmployeesMovementForm() {
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employee, setEmployee] = useState<IEmployeeToMovement | null>(null);
  const [action, setAction] = useState<'E' | 'S'>('E');
  const [requesting, setRequesting] = useState(false);
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<IEmployeeToMovement[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setRequesting(true);

      const response: IGetAllACtiveEmplyeesToMovementReturnProps = await getAllActiveEmployeesToMovementAction();
      if (response.success && response.data) {
        const employeeData = response.data as IEmployeeToMovement[];
        setEmployees(employeeData);
      } else {
        toast({
          variant: 'destructive',
          title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
          description: response.error,
        });
      }

      setRequesting(false);
    };

    fetchEmployees();
  }, [toast]);

  const searchEmployee = async () => {
    if (!selectedEmployeeId) {
      toast({
        variant: 'warning',
        title: MESSAGE.MOVEMENT.REQUIRED_INFORMATIONS_TITLE,
        description: MESSAGE.MOVEMENT.EMPLOYEE_REQUIRED,
      });
      return;
    }

    setRequesting(true);
    const found = employees.find((c) => c.id === selectedEmployeeId);
    setEmployee(found || null);
    setRequesting(false);

    if (!found) {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: MESSAGE.EMPLOYEE.NOT_FOUND,
      });
    }
  };

  const registerMovement = async () => {
    if (!employee) {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: MESSAGE.MOVEMENT.EMPLOYEE_REQUIRED,
      });
      return;
    }

    setRequesting(true);
    const response: ICreateEmployeeMovementReturnProps = await createEmployeeMovementAction({
      employeeId: employee.id,
      action,
    });

    if (response.success) {
      toast({
        variant: 'success',
        description: response.data,
      });
      setEmployee(null);
      setAction('E');
    } else {
      toast({
        variant: 'destructive',
        title: MESSAGE.COMMON.GENERIC_ERROR_TITLE,
        description: response.error,
      });
    }

    setRequesting(false);

    resetForm();
  };

  const resetForm = () => {
    setSelectedEmployeeId('');
    setEmployee(null);
    setAction('E');
  };

  return (
    <div className="w-full">
      {!employee ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Nome do colaborador</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={requesting}
                >
                  {selectedEmployeeId
                    ? employees.find((c) => c.id === selectedEmployeeId)
                        ?.fullName
                    : 'Selecione um colaborador'}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar colaborador..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>Nenhum colaborador encontrado.</CommandEmpty>
                    <CommandGroup>
                      {employees.map((employee) => (
                        <CommandItem
                          key={employee.id}
                          value={employee.fullName}
                          onSelect={() => {
                            setSelectedEmployeeId(employee.id);
                            setOpen(false);
                          }}
                        >
                          {employee.fullName}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              employee.id === selectedEmployeeId
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              Selecione o colaborador e clique em buscar. Você pode pesquisar
              pelo nome.
            </p>
          </div>
          <Button
            onClick={searchEmployee}
            disabled={requesting}
            className="w-full"
          >
            {requesting ? 'Buscando...' : 'Buscar colaborador'}
          </Button>
        </div>
      ) : (
        <div className="bg-secondary/90 rounded-lg p-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary">
              Informações do colaborador
            </h3>
            <p className="text-sm text-muted-foreground">
              Verifique as informações e registre a movimentação
            </p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="bg-background rounded-lg p-2 col-span-1 xl:col-span-3 flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  {employee.photoURL ? (
                    <Image
                      src={employee.photoURL}
                      alt={`Foto de ${employee.fullName}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                      <UserIcon className="w-24 h-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-1 xl:col-span-9">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div className="bg-background rounded-lg xl:col-span-2 p-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Nome
                    </h4>
                    <p className="text-base font-medium">{employee.fullName}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Matrícula
                    </h4>
                    <p className="text-base font-medium">
                      {employee.registration}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 col-span-full">
                    <h4 className="text-sm font-medium mb-1 text-destructive">
                      Observação
                    </h4>
                    <p className="text-base font-medium">
                      {employee.observation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Selecione a ação da movimentação
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <Button onClick={resetForm} variant="warning" className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

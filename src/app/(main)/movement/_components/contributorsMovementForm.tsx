'use client';

import React, { useState, useEffect } from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
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

import { getAllActiveContributors } from '@/actions/contributors/getAllActiveContributors';
import { IContributor } from '../../contributors/types';
import { UserIcon } from 'lucide-react';
import Image from 'next/image';
import { createContributorMovementAction } from '@/actions/movements/contributors/createContributorMovementAction';

export function ContributorMovementForm() {
  const { toast } = useToast();
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
  const [collaborator, setCollaborator] = useState<IContributor | null>(null);
  const [action, setAction] = useState<'E' | 'S'>('E');
  const [requesting, setRequesting] = useState(false);
  const [open, setOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<IContributor[]>([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        setRequesting(true);
        const fetchedCollaborators = await getAllActiveContributors();
        if (fetchedCollaborators.success) {
          setCollaborators(fetchedCollaborators.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Erro ao carregar colaboradores',
            description: 'Não foi possível carregar a lista de colaboradores.',
          });
        }
        setRequesting(false);
      } catch (error) {
        setRequesting(false);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar colaboradores',
          description: 'Não foi possível carregar a lista de colaboradores.',
        });
      }
    };

    fetchCollaborators();
  }, [toast]);

  const searchCollaborator = async () => {
    if (!selectedCollaboratorId) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar colaborador',
        description: 'Por favor, selecione um colaborador.',
      });
      return;
    }

    setRequesting(true);
    const found = collaborators.find((c) => c.id === selectedCollaboratorId);
    setCollaborator(found || null);
    setRequesting(false);

    if (!found) {
      toast({
        variant: 'destructive',
        title: 'Colaborador não encontrado',
        description: 'Não foi possível encontrar o colaborador selecionado.',
      });
    }
  };

  const registerMovement = async () => {
    if (!collaborator) {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar movimentação',
        description: 'Por favor, selecione um colaborador.',
      });
      return;
    }

    try {
      setRequesting(true);
      const response = await createContributorMovementAction(collaborator.id, action);

      if (response.success) {
        toast({
          variant: 'success',
          title: 'Movimentação registrada com sucesso',
          description: `${
            action === 'E' ? 'Entrada' : 'Saída'
          } registrada para o veículo ${collaborator.name}`,
        });
        setCollaborator(null);
        setAction('E');
      } else {
        toast({
          variant: 'destructive',
          title: 'Ocorreu um erro ao cadastrar a movimentação.',
          description: 'Entre em contato com a administração.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ocorreu um erro ao cadastrar a movimentação.',
        description: 'Entre em contato com a administração.',
      });
    } finally {
      setRequesting(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setSelectedCollaboratorId('');
    setCollaborator(null);
    setAction('E');
  };

  return (
    <div className="w-full">
      {!collaborator ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collaborator">Nome do colaborador</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={requesting}
                >
                  {selectedCollaboratorId
                    ? collaborators.find((c) => c.id === selectedCollaboratorId)
                        ?.name
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
                      {collaborators.map((collaborator) => (
                        <CommandItem
                          key={collaborator.id}
                          value={collaborator.name}
                          onSelect={() => {
                            setSelectedCollaboratorId(collaborator.id);
                            setOpen(false);
                          }}
                        >
                          {collaborator.name}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              collaborator.id === selectedCollaboratorId
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
            onClick={searchCollaborator}
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
                  {collaborator.photoURL ? (
                    <Image
                      src={collaborator.photoURL}
                      alt={`Foto de ${collaborator.name}`}
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
                  <div className="bg-background rounded-lg p-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Nome
                    </h4>
                    <p className="text-base font-medium">{collaborator.name}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Sobrenome
                    </h4>
                    <p className="text-base font-medium">
                      {collaborator.lastName}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Matrícula
                    </h4>
                    <p className="text-base font-medium">
                      {collaborator.registration}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 col-span-full">
                    <h4 className="text-sm font-medium mb-1 text-destructive">
                      Observação
                    </h4>
                    <p className="text-base font-medium">
                      {collaborator.observation}
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

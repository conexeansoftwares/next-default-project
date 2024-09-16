'use client';

import React from 'react';
import { Input } from '../input';
import { Button } from '../button';
import { useDataTable } from '@/context/dataTableContext';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Column, Table } from '@tanstack/react-table';

interface IDataTableTools {
  searchKey: string;
  searchPlaceholder: string;
}

type ColumnDef<T> = {
  header: string | ((props: { column: Column<T, unknown> }) => React.ReactNode);
};

export function DataTableTools<T>({
  searchKey,
  searchPlaceholder,
}: IDataTableTools) {
  const { table } = useDataTable() as { table: Table<T> };

  const getColumnTitle = (column: Column<T, unknown>): string => {
    const header = column.columnDef.header as ColumnDef<T>['header'];
    if (typeof header === 'function') {
      const headerContent = header({ column });
      if (React.isValidElement(headerContent) && 'title' in headerContent.props) {
        return headerContent.props.title as string;
      }
    }
    return typeof header === 'string' ? header : column.id;
  };

  return (
    <div className="flex items-center py-4">
      <Input
        placeholder={searchPlaceholder}
        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
        onChange={(value: string) =>
          table.getColumn(searchKey)?.setFilterValue(value)
        }
        className="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {getColumnTitle(column)}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

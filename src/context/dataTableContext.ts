/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react';
import { Table } from '@tanstack/react-table';

export interface DataTableContextValue<TData> {
  table: Table<TData>;
}

export const DataTableContext = createContext<DataTableContextValue<any> | undefined>(undefined);

export function useDataTable<TData>(): DataTableContextValue<TData> {
  const context = useContext(DataTableContext);
  if (context === undefined) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context as DataTableContextValue<TData>;
}

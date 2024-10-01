'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { useDataTable } from '@/context/dataTableContext';
import { ExpandableRow } from './dataTableExpandableRow';

interface DataTableContentProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  expandable?: boolean;
  renderExpanded?: (row: TData) => React.ReactNode;
  expandedRows?: Record<string, boolean>;
  onExpand?: (rowId: string) => void;
}

export function DataTableContent<TData, TValue>({
  columns,
  expandable = false,
  renderExpanded,
  expandedRows = {},
}: DataTableContentProps<TData, TValue>) {
  const { table } = useDataTable<TData>();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {expandable && renderExpanded && (
                  <ExpandableRow
                    colSpan={columns.length}
                    content={renderExpanded(row.original)}
                    isExpanded={!!expandedRows[row.id]}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum resultado encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

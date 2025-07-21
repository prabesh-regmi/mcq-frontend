"use client"

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, ArrowUpDown, Trash2, Search, Filter } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';

interface DataTableProps<T> {
  data: T[];
  columns: {
    accessorKey: keyof T;
    header: string;
    cell?: (data: T) => React.ReactNode;
    headClassName?: string;
    cellClassName?: string;
  }[];
  isFetching: boolean;
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  pageSize?: number;
  onDelete?: (selectedItems: T[]) => void;
  onSort?: (sortKey: keyof T | null) => void;
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filterValue: string) => void;
  filterOptions?: { label: string; value: string }[];
  customFilter?: React.ReactNode;
}

export function DataTable<T extends { id: any }>({
  data,
  columns,
  isFetching,
  totalCount,
  page,
  setPage,
  pageSize = 10,
  onDelete,
  onSort,
  onSearch,
  onFilter,
  filterOptions,
  customFilter,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? data : []);
  };

  const handleSelectRow = (row: T) => {
    setSelectedRows(prev =>
      prev.some(item => item.id === row.id)
        ? prev.filter(item => item.id !== row.id)
        : [...prev, row]
    );
  };

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalCount);

  return (
    <div className="rounded-lg border">
      {/* Sticky controls + table header */}
      <div className="sticky top-16 z-30 bg-muted">
        <div className="flex items-center justify-between p-4 pb-1">
          <div className="flex items-center gap-4">
            {onSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    onSearch(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
            )}
            {customFilter}
            {onDelete && selectedRows.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedRows.length})
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {start}-{end} of {totalCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={end >= totalCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="table-fixed">
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="bg-muted w-[5%] text-xs">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columns.map(col => (
                  <TableHead key={String(col.accessorKey)} className={`py-4 bg-muted text-xs ${col.headClassName || ''}`}>
                    <div className="flex items-center gap-2">
                      {col.header}
                      {onSort && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSort(col.accessorKey)}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      </div>
      {/* Table body (scrolls with page) */}
      <div className="overflow-x-auto">
        <Table className="table-fixed">
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map(row => (
                <TableRow key={row.id}>
                  <TableCell className="py-4 w-6">
                    <Checkbox
                      checked={selectedRows.some(item => item.id === row.id)}
                      onCheckedChange={() => handleSelectRow(row)}
                    />
                  </TableCell>
                  {columns.map(col => (
                    <TableCell key={String(col.accessorKey)} className={`py-4 text-xs ${col.cellClassName || ''}`}>
                      {col.cell ? col.cell(row) : String(row[col.accessorKey])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {onDelete && (
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => {
            onDelete(selectedRows);
            setSelectedRows([]);
            setIsDeleteDialogOpen(false);
          }}
          title="Are you sure?"
          description={`This will permanently delete ${selectedRows.length} item(s).`}
        />
      )}
    </div>
  );
} 
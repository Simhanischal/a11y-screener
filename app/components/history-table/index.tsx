"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { convertEpochToDateTime } from "@/app/lib/common-utils";

interface HistoryData {
  id: number;
  siteUrl: string;
  timestamp: bigint;
  userId: number;
}

export const columns: ColumnDef<HistoryData>[] = [
  {
    accessorKey: "siteUrl",
    size: 150,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Site URL
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-wrap md:truncate" title={row.getValue("siteUrl")}>{row.getValue("siteUrl")}</div>,
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{convertEpochToDateTime(row.getValue("timestamp"))}</div>,
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "id",
    header: "Results",
    cell: ({ row }) => (
      <Link
        href={`/history/results?id=${row.getValue("id")}`}
        className="flex items-center gap-2"
        role="link"
        aria-label="View result link"
      >
        View <ArrowRight role="presentation" size={15} />
      </Link>
    ),
  },
];

export default function HistoryTable({ data }: { data: HistoryData[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <Input
        placeholder="Filter Site URLs..."
        value={(table.getColumn("siteUrl")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("siteUrl")?.setFilterValue(event.target.value)
        }
      />
      <Table role="table" aria-label="Your Past screenings">
        <TableCaption>A list of your past screenings</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={`md:max-w-[100px]`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

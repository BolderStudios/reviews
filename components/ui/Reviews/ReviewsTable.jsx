import { useState } from "react";
import { Button } from "@/components/ui/Buttons/button";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/ui/DataTablePagination";

export function ReviewsTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  const resetAllFilters = () => {
    setColumnFilters([]);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center py-4">
        <Input
          placeholder="Search summaries..."
          value={table.getColumn("summary")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("summary")?.setFilterValue(event.target.value)
          }
          className="max-w-48"
        />
        <Select
          value={table.getColumn("rating")?.getFilterValue() ?? ""}
          onValueChange={(value) =>
            table.getColumn("rating")?.setFilterValue(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Star{rating > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={table.getColumn("sentiment")?.getFilterValue() ?? ""}
          onValueChange={(value) =>
            table.getColumn("sentiment")?.setFilterValue(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Sentiment" />
          </SelectTrigger>
          <SelectContent>
            {["Positive", "Negative", "Mixed"].map((sentiment) => (
              <SelectItem key={sentiment} value={sentiment}>
                {sentiment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={table.getColumn("source")?.getFilterValue() ?? ""}
          onValueChange={(value) =>
            table.getColumn("source")?.setFilterValue(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Source" />
          </SelectTrigger>
          <SelectContent>
            {["google", "yelp"].map((source) => (
              <SelectItem key={source} value={source}>
                {source[0].toUpperCase() + source.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={table.getColumn("has_responded_to")?.getFilterValue() ?? ""}
          onValueChange={(value) =>
            table.getColumn("has_responded_to")?.setFilterValue(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Response Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Responded</SelectItem>
            <SelectItem value="false">Not Responded</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={resetAllFilters} variant="outline">
          Reset All Filters
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-12">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

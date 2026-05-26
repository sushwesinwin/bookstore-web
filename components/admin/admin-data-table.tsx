"use client";

import { Fragment, type ReactNode, useMemo, useState } from "react";
import { RotateCcw, Search, Settings2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AdminDataTableColumn<TKey extends string> = {
  key: TKey;
  label: string;
  className?: string;
  required?: boolean;
};

export type AdminDataTableFilter<TItem, TKey extends string> = {
  key: TKey;
  label: string;
  defaultValue: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  predicate: (item: TItem, value: string) => boolean;
};

type AdminDataTableProps<
  TItem,
  TColumnKey extends string,
  TFilterKey extends string,
> = {
  columns: Array<AdminDataTableColumn<TColumnKey>>;
  configureDescription?: string;
  configureTitle?: string;
  defaultColumnVisibility?: Record<TColumnKey, boolean>;
  emptyMessage: string;
  filters?: Array<AdminDataTableFilter<TItem, TFilterKey>>;
  getRowId: (item: TItem) => string;
  items: TItem[];
  pageSizeOptions?: number[];
  renderRow: (
    item: TItem,
    visibleColumns: Record<TColumnKey, boolean>,
  ) => ReactNode;
  searchPlaceholder?: string;
  searchPredicate: (item: TItem, query: string) => boolean;
  tableClassName?: string;
};

const defaultPageSizeOptions = [5, 10, 20, 50];

export function AdminDataTable<
  TItem,
  TColumnKey extends string,
  TFilterKey extends string,
>({
  columns,
  configureDescription = "Choose visible fields.",
  configureTitle = "Configure view",
  defaultColumnVisibility,
  emptyMessage,
  filters = [],
  getRowId,
  items,
  pageSizeOptions = defaultPageSizeOptions,
  renderRow,
  searchPlaceholder = "Search",
  searchPredicate,
  tableClassName = "min-w-[920px]",
}: AdminDataTableProps<TItem, TColumnKey, TFilterKey>) {
  const initialColumnVisibility = useMemo(
    () =>
      columns.reduce(
        (visibility, column) => ({
          ...visibility,
          [column.key]: defaultColumnVisibility?.[column.key] ?? true,
        }),
        {} as Record<TColumnKey, boolean>,
      ),
    [columns, defaultColumnVisibility],
  );
  const initialFilterValues = useMemo(
    () =>
      filters.reduce(
        (values, filter) => ({
          ...values,
          [filter.key]: filter.defaultValue,
        }),
        {} as Record<TFilterKey, string>,
      ),
    [filters],
  );

  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] =
    useState<Record<TFilterKey, string>>(initialFilterValues);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[1] ?? pageSizeOptions[0] ?? 10);
  const [columnVisibility, setColumnVisibility] =
    useState<Record<TColumnKey, boolean>>(initialColumnVisibility);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedQuery || searchPredicate(item, normalizedQuery);
      const matchesFilters = filters.every((filter) => {
        const value = filterValues[filter.key] ?? filter.defaultValue;

        return value === filter.defaultValue || filter.predicate(item, value);
      });

      return matchesSearch && matchesFilters;
    });
  }, [filterValues, filters, items, query, searchPredicate]);

  const activeFilterCount = filters.filter((filter) => {
    const value = filterValues[filter.key] ?? filter.defaultValue;

    return value !== filter.defaultValue;
  }).length;
  const visibleColumnCount = columns.filter(
    (column) => columnVisibility[column.key],
  ).length;
  const isDefaultColumnVisibility = columns.every(
    (column) =>
      columnVisibility[column.key] === initialColumnVisibility[column.key],
  );
  const totalPages = Math.max(Math.ceil(filteredItems.length / pageSize), 1);
  const visiblePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (visiblePage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(
    pageStartIndex,
    pageStartIndex + pageSize,
  );
  const resultStart = filteredItems.length === 0 ? 0 : pageStartIndex + 1;
  const resultEnd = Math.min(pageStartIndex + pageSize, filteredItems.length);
  const paginationItems = getPaginationItems(totalPages, visiblePage);

  function updateFilter(key: TFilterKey, value: string) {
    setFilterValues((current) => ({
      ...current,
      [key]: value,
    }));
    setCurrentPage(1);
  }

  function setColumn(key: TColumnKey, checked: boolean) {
    const column = columns.find((item) => item.key === key);

    if (column?.required) {
      return;
    }

    setColumnVisibility((current) => ({
      ...current,
      [key]: checked,
    }));
  }

  function resetColumns() {
    if (!isDefaultColumnVisibility) {
      setColumnVisibility(initialColumnVisibility);
    }
  }

  function resetFilters() {
    setFilterValues(initialFilterValues);
    setCurrentPage(1);
  }

  function closeSearch() {
    setQuery("");
    setIsSearchOpen(false);
    setCurrentPage(1);
  }

  return (
    <div className="grid w-full min-w-0 gap-3">
      <div className="grid gap-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            <div
              className={`grid overflow-hidden transition-[width,opacity] duration-200 ease-out ${
                isSearchOpen
                  ? "w-full opacity-100 sm:w-80"
                  : "w-0 opacity-0"
              }`}
            >
              <div className="relative min-w-0">
                <Label htmlFor="admin-table-search" className="sr-only">
                  Search
                </Label>
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="admin-table-search"
                  value={query}
                  autoFocus
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      closeSearch();
                    }
                  }}
                  placeholder={searchPlaceholder}
                  tabIndex={isSearchOpen ? 0 : -1}
                  className="h-9 rounded-full border bg-background pr-9 pl-9 shadow-none transition-colors"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close search"
                  onClick={closeSearch}
                  className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
              className={`transition-[opacity,width,margin] duration-200 ${
                isSearchOpen
                  ? "pointer-events-none w-0 opacity-0"
                  : "w-9 opacity-100"
              }`}
            >
              <Search />
            </Button>

            {filters.map((filter) => (
              <div
                key={filter.key}
                className="grid min-w-32 gap-1 rounded-full bg-muted/40 p-1"
              >
                <Label
                  htmlFor={`admin-table-filter-${filter.key}`}
                  className="sr-only"
                >
                  {filter.label}
                </Label>
                <Select
                  value={filterValues[filter.key] ?? filter.defaultValue}
                  onValueChange={(value) => updateFilter(filter.key, value)}
                >
                  <SelectTrigger
                    id={`admin-table-filter-${filter.key}`}
                    className="h-8 rounded-full border bg-background px-3 text-xs shadow-none"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {filters.length > 0 ? (
              <div className="rounded-full bg-muted/40 p-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Clear filters"
                  onClick={resetFilters}
                  disabled={activeFilterCount === 0}
                  className={`size-8 rounded-full shadow-none transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:bg-background ${
                    activeFilterCount > 0
                      ? "border-red-600 bg-red-600 text-white hover:bg-red-700 hover:text-white"
                      : ""
                  }`}
                >
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1">
            <div className="rounded-full bg-muted/40 p-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Configure view"
                onClick={() => setIsConfigureOpen(true)}
                className="size-8 rounded-full bg-background shadow-none"
              >
                <Settings2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden bg-background">
        <Table className={tableClassName}>
          <TableHeader>
            <TableRow>
              {columns.map((column) =>
                columnVisibility[column.key] ? (
                  <TableHead key={column.key} className={column.className}>
                    {column.label}
                  </TableHead>
                ) : null,
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="text-muted-foreground h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <Fragment key={getRowId(item)}>
                  {renderRow(item, columnVisibility)}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredItems.length > 0 ? (
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-muted/40 p-1">
            <p className="text-muted-foreground px-2 text-xs">
              {resultStart}-{resultEnd} of {filteredItems.length}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs">Show</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-20 rounded-full border bg-background px-3 text-xs shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Pagination className="mx-0 w-auto justify-start rounded-full bg-muted/40 p-1 sm:justify-end">
            <PaginationContent className="gap-0.5">
              <PaginationItem>
                <PaginationPrevious
                  type="button"
                  className="rounded-full"
                  disabled={visiblePage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                />
              </PaginationItem>
              {paginationItems.map((item, index) => (
                <PaginationItem key={`${item}-${index}`}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationButton
                      type="button"
                      isActive={item === visiblePage}
                      className="rounded-full"
                      aria-label={`Go to page ${item}`}
                      aria-current={item === visiblePage ? "page" : undefined}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </PaginationButton>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  type="button"
                  className="rounded-full"
                  disabled={visiblePage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(page + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}

      <Dialog open={isConfigureOpen} onOpenChange={setIsConfigureOpen}>
        <DialogContent className="max-w-sm gap-3 p-5">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-6">
              <div className="grid gap-1">
                <DialogTitle>{configureTitle}</DialogTitle>
                <DialogDescription>{configureDescription}</DialogDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetColumns}
                disabled={isDefaultColumnVisibility}
                className={
                  isDefaultColumnVisibility
                    ? ""
                    : "text-red-600 hover:bg-red-50 hover:text-red-700"
                }
              >
                Reset
              </Button>
            </div>
          </DialogHeader>

          <div className="grid divide-y">
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{column.label}</p>
                  {column.required ? (
                    <p className="text-muted-foreground text-xs">
                      Required column
                    </p>
                  ) : null}
                </div>
                <Switch
                  checked={columnVisibility[column.key]}
                  disabled={column.required}
                  onCheckedChange={(checked) => setColumn(column.key, checked)}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getPaginationItems(totalPages: number, currentPage: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}

"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search, Settings2, X } from "lucide-react";

import {
  BookDetailDialog,
  type BookTableColumn,
  type BookTableColumnVisibility,
} from "@/components/admin/book-detail-dialog";
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
import type { Book } from "@/lib/books";
import type { Category } from "@/lib/categories";

type BooksTableProps = {
  books: Book[];
  categories: Category[];
};

type StockFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";
type SellerFilter = "all" | "best_seller" | "regular";

const pageSizeOptions = [5, 10, 20, 50];

const tableColumns: Array<{
  key: BookTableColumn;
  label: string;
  className?: string;
  required?: boolean;
}> = [
  { key: "cover", label: "Cover", className: "w-16" },
  { key: "title", label: "Title", required: true },
  { key: "author", label: "Author" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "price", label: "Price", className: "text-right" },
  { key: "stock", label: "Stock", className: "text-right" },
  { key: "updated", label: "Updated" },
];

const defaultColumnVisibility: BookTableColumnVisibility = {
  cover: true,
  title: true,
  author: true,
  category: true,
  status: true,
  price: true,
  stock: true,
  updated: true,
};

export function BooksTable({ books, categories }: BooksTableProps) {
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sellerFilter, setSellerFilter] = useState<SellerFilter>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnVisibility, setColumnVisibility] =
    useState<BookTableColumnVisibility>(defaultColumnVisibility);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return books.filter((book) => {
      const searchableValues = [
        book.title,
        book.author,
        book.description,
        book.category?.name,
      ];
      const matchesQuery =
        !normalizedQuery ||
        searchableValues
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));
      const matchesCategory =
        selectedCategoryId === "all" ||
        (selectedCategoryId === "uncategorized"
          ? !book.categoryId
          : book.categoryId === selectedCategoryId);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "out_of_stock" && book.stock <= 0) ||
        (stockFilter === "low_stock" && book.stock > 0 && book.stock <= 5) ||
        (stockFilter === "in_stock" && book.stock > 5);
      const matchesSeller =
        sellerFilter === "all" ||
        (sellerFilter === "best_seller" && book.isBestSeller) ||
        (sellerFilter === "regular" && !book.isBestSeller);

      return matchesQuery && matchesCategory && matchesStock && matchesSeller;
    });
  }, [books, query, selectedCategoryId, sellerFilter, stockFilter]);

  const activeFilterCount = [
    selectedCategoryId !== "all",
    stockFilter !== "all",
    sellerFilter !== "all",
  ].filter(Boolean).length;
  const visibleColumnCount = tableColumns.filter(
    (column) => columnVisibility[column.key],
  ).length;
  const isDefaultColumnVisibility = tableColumns.every(
    (column) => columnVisibility[column.key] === defaultColumnVisibility[column.key],
  );
  const totalPages = Math.max(Math.ceil(filteredBooks.length / pageSize), 1);
  const visiblePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (visiblePage - 1) * pageSize;
  const paginatedBooks = filteredBooks.slice(
    pageStartIndex,
    pageStartIndex + pageSize,
  );
  const resultStart = filteredBooks.length === 0 ? 0 : pageStartIndex + 1;
  const resultEnd = Math.min(pageStartIndex + pageSize, filteredBooks.length);
  const paginationItems = getPaginationItems(totalPages, visiblePage);

  function setColumn(key: BookTableColumn, checked: boolean) {
    setColumnVisibility((current) => ({
      ...current,
      [key]: checked,
      title: true,
    }));
  }

  function resetColumns() {
    if (!isDefaultColumnVisibility) {
      setColumnVisibility(defaultColumnVisibility);
    }
  }

  function resetFilters() {
    setSelectedCategoryId("all");
    setStockFilter("all");
    setSellerFilter("all");
    setCurrentPage(1);
  }

  function closeSearch() {
    setQuery("");
    setIsSearchOpen(false);
    setCurrentPage(1);
  }

  return (
    <div id="books" className="grid w-full min-w-0 gap-3">
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
                <Label htmlFor="admin-book-search" className="sr-only">
                  Search books
                </Label>
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="admin-book-search"
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
                  placeholder="Search books"
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
              aria-label="Search books"
              onClick={() => setIsSearchOpen(true)}
              className={`transition-[opacity,width,margin] duration-200 ${
                isSearchOpen
                  ? "pointer-events-none w-0 opacity-0"
                  : "w-9 opacity-100"
              }`}
            >
              <Search />
            </Button>
            <div className="grid min-w-36 gap-1 rounded-full bg-muted/40 p-1">
              <Label htmlFor="admin-book-category-filter" className="sr-only">
                Category
              </Label>
              <Select
                value={selectedCategoryId}
                onValueChange={(value) => {
                  setSelectedCategoryId(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger
                  id="admin-book-category-filter"
                  className="h-8 rounded-full border bg-background px-3 text-xs shadow-none"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid min-w-32 gap-1 rounded-full bg-muted/40 p-1">
              <Label htmlFor="admin-book-stock-filter" className="sr-only">
                Stock
              </Label>
              <Select
                value={stockFilter}
                onValueChange={(value) => {
                  setStockFilter(value as StockFilter);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger
                  id="admin-book-stock-filter"
                  className="h-8 rounded-full border bg-background px-3 text-xs shadow-none"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stock</SelectItem>
                  <SelectItem value="in_stock">In stock</SelectItem>
                  <SelectItem value="low_stock">Low stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid min-w-32 gap-1 rounded-full bg-muted/40 p-1">
              <Label htmlFor="admin-book-seller-filter" className="sr-only">
                Type
              </Label>
              <Select
                value={sellerFilter}
                onValueChange={(value) => {
                  setSellerFilter(value as SellerFilter);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger
                  id="admin-book-seller-filter"
                  className="h-8 rounded-full border bg-background px-3 text-xs shadow-none"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All books</SelectItem>
                  <SelectItem value="best_seller">Best sellers</SelectItem>
                  <SelectItem value="regular">Regular books</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow>
              {tableColumns.map((column) =>
                columnVisibility[column.key] ? (
                  <TableHead key={column.key} className={column.className}>
                    {column.label}
                  </TableHead>
                ) : null,
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="text-muted-foreground h-24 text-center"
                >
                  No books found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedBooks.map((book) => (
                <BookDetailDialog
                  key={book.id}
                  book={book}
                  categories={categories}
                  visibleColumns={columnVisibility}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-muted/40 p-1">
            <p className="text-muted-foreground px-2 text-xs">
              {resultStart}-{resultEnd} of {filteredBooks.length}
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
                <DialogTitle>Configure view</DialogTitle>
                <DialogDescription>
                  Choose visible fields.
                </DialogDescription>
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
            {tableColumns.map((column) => (
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

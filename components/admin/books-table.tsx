"use client";

import {
  AdminDataTable,
  type AdminDataTableColumn,
  type AdminDataTableFilter,
} from "@/components/admin/admin-data-table";
import {
  BookDetailDialog,
  type BookTableColumn,
  type BookTableColumnVisibility,
} from "@/components/admin/book-detail-dialog";
import type { Book } from "@/lib/books";
import type { Category } from "@/lib/categories";

type BooksTableProps = {
  books: Book[];
  categories: Category[];
};

type BookFilterKey = "category" | "stock" | "type";

const tableColumns: Array<AdminDataTableColumn<BookTableColumn>> = [
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
  const filters: Array<AdminDataTableFilter<Book, BookFilterKey>> = [
    {
      key: "category",
      label: "Category",
      defaultValue: "all",
      options: [
        { label: "All categories", value: "all" },
        { label: "Uncategorized", value: "uncategorized" },
        ...categories.map((category) => ({
          label: category.name,
          value: category.id,
        })),
      ],
      predicate: (book, value) =>
        value === "uncategorized" ? !book.categoryId : book.categoryId === value,
    },
    {
      key: "stock",
      label: "Stock",
      defaultValue: "all",
      options: [
        { label: "All stock", value: "all" },
        { label: "In stock", value: "in_stock" },
        { label: "Low stock", value: "low_stock" },
        { label: "Out of stock", value: "out_of_stock" },
      ],
      predicate: (book, value) =>
        (value === "out_of_stock" && book.stock <= 0) ||
        (value === "low_stock" && book.stock > 0 && book.stock <= 5) ||
        (value === "in_stock" && book.stock > 5),
    },
    {
      key: "type",
      label: "Type",
      defaultValue: "all",
      options: [
        { label: "All books", value: "all" },
        { label: "Best sellers", value: "best_seller" },
        { label: "Regular books", value: "regular" },
      ],
      predicate: (book, value) =>
        value === "best_seller" ? book.isBestSeller : !book.isBestSeller,
    },
  ];

  return (
    <div id="books">
      <AdminDataTable
        columns={tableColumns}
        defaultColumnVisibility={defaultColumnVisibility}
        emptyMessage="No books found."
        filters={filters}
        getRowId={(book) => book.id}
        items={books}
        renderRow={(book, visibleColumns) => (
          <BookDetailDialog
            book={book}
            categories={categories}
            visibleColumns={visibleColumns}
          />
        )}
        searchPlaceholder="Search books"
        searchPredicate={(book, query) =>
          [book.title, book.author, book.description, book.category?.name]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(query))
        }
      />
    </div>
  );
}

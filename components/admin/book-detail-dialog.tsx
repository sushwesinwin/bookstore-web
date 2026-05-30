"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  deleteBookAction,
  updateBookAction,
} from "@/app/admin/books/actions";
import { BookForm } from "@/components/admin/book-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { getBookImageUrl, type Book } from "@/lib/books";
import type { Category } from "@/lib/categories";

type BookDetailDialogProps = {
  book: Book;
  categories: Category[];
  visibleColumns?: BookTableColumnVisibility;
};

export type BookTableColumn =
  | "cover"
  | "title"
  | "category"
  | "status"
  | "price"
  | "stock"
  | "updated";

export type BookTableColumnVisibility = Record<BookTableColumn, boolean>;

function formatCurrency(value: string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInventoryState(stock: number) {
  if (stock <= 0) {
    return { label: "Out of stock", variant: "warning" as const };
  }

  if (stock <= 5) {
    return { label: "Low stock", variant: "warning" as const };
  }

  return { label: "In stock", variant: "success" as const };
}

export function BookDetailDialog({
  book,
  categories,
  visibleColumns = {
    cover: true,
    title: true,
    category: true,
    status: true,
    price: true,
    stock: true,
    updated: true,
  },
}: BookDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mode, setMode] = useState<"detail" | "edit">("detail");
  const [isPending, startTransition] = useTransition();
  const updateAction = updateBookAction.bind(null, book.id);
  const imageUrl = getBookImageUrl(book.imageUrl);
  const inventory = getInventoryState(book.stock);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      setMode("detail");
    }
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteBookAction(book.id);
      setIsDeleteOpen(false);
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <TableRow
        className="cursor-pointer"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {visibleColumns.cover ? (
          <TableCell>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${book.title} cover`}
                width={48}
                height={48}
                className="size-12 rounded-md border object-cover"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-md border text-xs">
                No image
              </div>
            )}
          </TableCell>
        ) : null}
        {visibleColumns.title ? (
          <TableCell>
            <div className="max-w-80">
              <p className="truncate font-medium">{book.title}</p>
              {book.description ? (
                <p className="text-muted-foreground mt-1 truncate text-xs">
                  {book.description}
                </p>
              ) : null}
            </div>
          </TableCell>
        ) : null}
        {visibleColumns.category ? (
          <TableCell>
            {book.category ? (
              <Badge variant="outline">{book.category.name}</Badge>
            ) : (
              <span className="text-muted-foreground text-sm">
                Uncategorized
              </span>
            )}
          </TableCell>
        ) : null}
        {visibleColumns.status ? (
          <TableCell>
            <div className="flex flex-wrap gap-1">
              <Badge variant={inventory.variant}>{inventory.label}</Badge>
              {book.isBestSeller ? (
                <Badge variant="secondary">Best seller</Badge>
              ) : null}
            </div>
          </TableCell>
        ) : null}
        {visibleColumns.price ? (
          <TableCell className="text-right font-medium">
            {formatCurrency(book.price)}
          </TableCell>
        ) : null}
        {visibleColumns.stock ? (
          <TableCell className="text-right">
            {book.stock.toLocaleString("en-US")}
          </TableCell>
        ) : null}
        {visibleColumns.updated ? (
          <TableCell className="text-muted-foreground">
            {formatShortDate(book.updatedAt)}
          </TableCell>
        ) : null}
      </TableRow>

      <DialogContent className={mode === "edit" ? "max-w-3xl" : "max-w-2xl"}>
        {mode === "edit" ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit book</DialogTitle>
              <DialogDescription>
                Update catalog, pricing, inventory, and image details.
              </DialogDescription>
            </DialogHeader>
            <BookForm
              action={updateAction}
              book={book}
              categories={categories}
              onCancel={() => setMode("detail")}
              title="Book details"
              description="Changes are saved to the catalog."
              submitLabel="Save changes"
            />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{book.title}</DialogTitle>
              <DialogDescription>Book details</DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
              <div className="bg-muted text-muted-foreground flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md border text-sm">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${book.title} cover`}
                    width={320}
                    height={427}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "No image"
                )}
              </div>

              <div className="grid gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Description</p>
                  <p className="mt-1 text-sm">
                    {book.description || "No description provided."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Price</p>
                    <p className="mt-1 font-medium">
                      {formatCurrency(book.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Stock</p>
                    <p className="mt-1 font-medium">
                      {book.stock.toLocaleString("en-US")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Category</p>
                  <p className="mt-1 text-sm font-medium">
                    {book.category?.name || "Uncategorized"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant={inventory.variant}>{inventory.label}</Badge>
                    {book.isBestSeller ? (
                      <Badge variant="secondary">Best seller</Badge>
                    ) : null}
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Best seller</p>
                  <p className="mt-1 text-sm font-medium">
                    {book.isBestSeller ? "Yes" : "No"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Created</p>
                    <p className="mt-1 text-sm">{formatDate(book.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Updated</p>
                    <p className="mt-1 text-sm">{formatDate(book.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setMode("edit");
                }}
              >
                <Pencil />
                Edit book
              </Button>
              <Button
                variant="destructive"
                disabled={isPending}
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 />
                Delete book
              </Button>
            </div>
          </>
        )}
      </DialogContent>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete book?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{book.title}&quot; from the
              catalog.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash2 />
              Delete book
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

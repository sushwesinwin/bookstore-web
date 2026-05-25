"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  deleteBookAction,
  updateBookAction,
} from "@/app/admin/books/actions";
import { BookForm } from "@/components/admin/book-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Book } from "@/lib/books";

type BookActionsProps = {
  book: Book;
};

export function BookActions({ book }: BookActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateAction = updateBookAction.bind(null, book.id);

  function handleDelete() {
    const confirmed = window.confirm("Delete this book?");

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteBookAction(book.id);
    });
  }

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open book actions"
            variant="ghost"
            size="icon"
            disabled={isPending}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setIsEditOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            disabled={isPending}
            onSelect={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
          <DialogDescription>
            Update catalog, pricing, inventory, and image details.
          </DialogDescription>
        </DialogHeader>
        <BookForm
          action={updateAction}
          book={book}
          cancelHref="/admin/books"
          title="Book details"
          description="Changes are saved to the catalog."
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  );
}

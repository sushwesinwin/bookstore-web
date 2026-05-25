"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { createBookAction } from "@/app/admin/books/actions";
import { BookForm } from "@/components/admin/book-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@/lib/categories";

type AddBookDialogProps = {
  categories: Category[];
};

export function AddBookDialog({ categories }: AddBookDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>
        <Plus />
        Add book
      </Button>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
          <DialogDescription>Create a new catalog record.</DialogDescription>
        </DialogHeader>
        <BookForm
          action={createBookAction}
          categories={categories}
          onCancel={() => setIsOpen(false)}
          title="Book details"
          description="Add catalog, pricing, inventory, and image details."
          submitLabel="Create book"
        />
      </DialogContent>
    </Dialog>
  );
}

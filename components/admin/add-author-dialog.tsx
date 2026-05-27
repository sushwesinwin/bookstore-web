"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { createAuthorAction } from "@/app/admin/authors/actions";
import { AuthorForm } from "@/components/admin/author-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddAuthorDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add author
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add author</DialogTitle>
          <DialogDescription>Create an author record.</DialogDescription>
        </DialogHeader>
        <AuthorForm
          action={createAuthorAction}
          onCancel={() => setIsOpen(false)}
          submitLabel="Create author"
        />
      </DialogContent>
    </Dialog>
  );
}

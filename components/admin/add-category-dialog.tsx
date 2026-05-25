"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { createCategoryAction } from "@/app/admin/categories/actions";
import { CategoryForm } from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddCategoryDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
          <DialogDescription>
            Create a category from the categories endpoint.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          action={createCategoryAction}
          onCancel={() => setIsOpen(false)}
          submitLabel="Create category"
        />
      </DialogContent>
    </Dialog>
  );
}

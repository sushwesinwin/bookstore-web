"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  deleteCategoryAction,
  updateCategoryAction,
  updateCategoryStatusAction,
} from "@/app/admin/categories/actions";
import { CategoryForm } from "@/components/admin/category-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryImageUrl, type Category } from "@/lib/categories";

type CategoriesTableProps = {
  categories: Category[];
};

function formatDate(value: string) {
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

export function CategoriesTable({ categories }: CategoriesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Catalog categories</CardTitle>
        <CardDescription>
          Manage categories from the category endpoint.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground h-24 text-center"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateAction = updateCategoryAction.bind(null, category.id);
  const nextStatus = category.status === "active" ? "inactive" : "active";
  const imageUrl = getCategoryImageUrl(category.imageUrl);

  function handleStatusChange() {
    const formData = new FormData();
    formData.set("status", nextStatus);

    startTransition(async () => {
      await updateCategoryStatusAction(category.id, formData);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteCategoryAction(category.id);
      setIsDeleteOpen(false);
    });
  }

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{category.name}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Switch
              checked={category.status === "active"}
              disabled={isPending}
              aria-label={`Set ${category.name} status`}
              onCheckedChange={handleStatusChange}
            />
            <Badge
              variant={category.status === "active" ? "success" : "secondary"}
            >
              {category.status}
            </Badge>
          </div>
        </TableCell>
        <TableCell>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${category.name} category`}
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
        <TableCell className="text-muted-foreground">
          {formatDate(category.updatedAt)}
        </TableCell>
        <TableCell>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil />
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 />
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>
              Update the category name, image, and status.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            action={updateAction}
            category={category}
            onCancel={() => setIsEditOpen(false)}
            submitLabel="Save changes"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{category.name}&quot;.
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
              Delete category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

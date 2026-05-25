"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  deleteCategoryAction,
  updateCategoryAction,
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
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
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
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mode, setMode] = useState<"detail" | "edit">("detail");
  const [isPending, startTransition] = useTransition();
  const updateAction = updateCategoryAction.bind(null, category.id);
  const imageUrl = getCategoryImageUrl(category.imageUrl);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      setMode("detail");
    }
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteCategoryAction(category.id);
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
        <TableCell className="font-medium">{category.name}</TableCell>
        <TableCell>
          <Badge
            variant={category.status === "active" ? "success" : "secondary"}
          >
            {category.status}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {formatDate(category.updatedAt)}
        </TableCell>
      </TableRow>

      <DialogContent className={mode === "edit" ? "max-w-xl" : "max-w-2xl"}>
        {mode === "edit" ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit category</DialogTitle>
              <DialogDescription>
                Update the category name, image, and status.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              action={updateAction}
              category={category}
              onCancel={() => setMode("detail")}
              submitLabel="Save changes"
            />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{category.name}</DialogTitle>
              <DialogDescription>Category details</DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
              <div className="bg-muted text-muted-foreground flex aspect-square items-center justify-center overflow-hidden rounded-md border text-sm">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${category.name} category`}
                    width={320}
                    height={320}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "No image"
                )}
              </div>

              <div className="grid gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Name</p>
                  <p className="mt-1 text-sm font-medium">{category.name}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <div className="mt-1">
                    <Badge
                      variant={
                        category.status === "active" ? "success" : "secondary"
                      }
                    >
                      {category.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Image URL</p>
                  <p className="text-muted-foreground mt-1 max-w-md truncate text-sm">
                    {category.imageUrl || "No image"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Created</p>
                    <p className="mt-1 text-sm">
                      {formatDate(category.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Updated</p>
                    <p className="mt-1 text-sm">
                      {formatDate(category.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setMode("edit")}>
                <Pencil />
                Edit
              </Button>
              <Button
                variant="destructive"
                disabled={isPending}
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 />
                Delete
              </Button>
            </div>
          </>
        )}
      </DialogContent>

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
    </Dialog>
  );
}

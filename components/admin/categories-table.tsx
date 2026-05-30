"use client";

import {
  useState,
  useTransition,
} from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/categories/actions";
import {
  AdminDataTable,
  type AdminDataTableColumn,
  type AdminDataTableFilter,
} from "@/components/admin/admin-data-table";
import { CategoryForm } from "@/components/admin/category-form";
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
import type { Category } from "@/lib/categories";

type CategoriesTableProps = {
  categories: Category[];
};

type CategoryTableColumn = "name" | "status" | "updated";
type CategoryFilterKey = "status";
type CategoryColumnVisibility = Record<CategoryTableColumn, boolean>;

const tableColumns: Array<AdminDataTableColumn<CategoryTableColumn>> = [
  { key: "name", label: "Name", required: true, sortable: true },
  { key: "status", label: "Status", sortable: true },
  {
    key: "updated",
    label: "Updated",
    sortable: true,
    sortValue: (item) => (item as Category).updatedAt,
  },
];

const defaultColumnVisibility: CategoryColumnVisibility = {
  name: true,
  status: true,
  updated: true,
};

const filters: Array<AdminDataTableFilter<Category, CategoryFilterKey>> = [
  {
    key: "status",
    label: "Status",
    defaultValue: "all",
    options: [
      { label: "All statuses", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    predicate: (category, value) => category.status === value,
  },
];

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
    <AdminDataTable
      columns={tableColumns}
      defaultColumnVisibility={defaultColumnVisibility}
      emptyMessage="No categories found."
      filters={filters}
      getRowId={(category) => category.id}
      items={categories}
      renderRow={(category, visibleColumns) => (
        <CategoryRow category={category} visibleColumns={visibleColumns} />
      )}
      searchPlaceholder="Search categories"
      searchPredicate={(category, query) =>
        [category.name, category.status].some((value) =>
          value.toLowerCase().includes(query),
        )
      }
      tableClassName="min-w-[640px]"
    />
  );
}

function CategoryRow({
  category,
  visibleColumns,
}: {
  category: Category;
  visibleColumns: CategoryColumnVisibility;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mode, setMode] = useState<"detail" | "edit">("detail");
  const [isPending, startTransition] = useTransition();
  const updateAction = updateCategoryAction.bind(null, category.id);

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
        {visibleColumns.name ? (
          <TableCell className="font-medium">{category.name}</TableCell>
        ) : null}
        {visibleColumns.status ? (
          <TableCell>
            <Badge
              variant={category.status === "active" ? "success" : "secondary"}
            >
              {category.status}
            </Badge>
          </TableCell>
        ) : null}
        {visibleColumns.updated ? (
          <TableCell className="text-muted-foreground">
            {formatDate(category.updatedAt)}
          </TableCell>
        ) : null}
      </TableRow>

      <DialogContent className="max-w-xl">
        {mode === "edit" ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit category</DialogTitle>
              <DialogDescription>
                Update the category name and status.
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

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setMode("edit");
                }}
              >
                <Pencil />
                Edit category
              </Button>
              <Button
                variant="destructive"
                disabled={isPending}
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 />
                Delete category
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

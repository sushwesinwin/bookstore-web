"use client";

import {
  type KeyboardEvent,
  type MouseEvent,
  useState,
  useTransition,
} from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  deleteAuthorAction,
  updateAuthorAction,
} from "@/app/admin/authors/actions";
import {
  AdminDataTable,
  type AdminDataTableColumn,
  type AdminDataTableFilter,
} from "@/components/admin/admin-data-table";
import { AuthorForm } from "@/components/admin/author-form";
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
import type { Author } from "@/lib/authors";

type AuthorsTableProps = {
  authors: Author[];
};

type AuthorTableColumn = "name" | "bio" | "status" | "updated" | "actions";
type AuthorFilterKey = "status";
type AuthorColumnVisibility = Record<AuthorTableColumn, boolean>;

const tableColumns: Array<AdminDataTableColumn<AuthorTableColumn>> = [
  { key: "name", label: "Name", required: true, sortable: true },
  { key: "bio", label: "Bio", sortable: true },
  { key: "status", label: "Status", sortable: true },
  {
    key: "updated",
    label: "Updated",
    sortable: true,
    sortValue: (item) => (item as Author).updatedAt,
  },
  {
    key: "actions",
    label: "Actions",
    className: "w-28 text-right",
    required: true,
  },
];

const defaultColumnVisibility: AuthorColumnVisibility = {
  name: true,
  bio: true,
  status: true,
  updated: true,
  actions: true,
};

const filters: Array<AdminDataTableFilter<Author, AuthorFilterKey>> = [
  {
    key: "status",
    label: "Status",
    defaultValue: "all",
    options: [
      { label: "All statuses", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    predicate: (author, value) => author.status === value,
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

export function AuthorsTable({ authors }: AuthorsTableProps) {
  return (
    <AdminDataTable
      columns={tableColumns}
      defaultColumnVisibility={defaultColumnVisibility}
      emptyMessage="No authors found."
      filters={filters}
      getRowId={(author) => author.id}
      items={authors}
      renderRow={(author, visibleColumns) => (
        <AuthorRow author={author} visibleColumns={visibleColumns} />
      )}
      searchPlaceholder="Search authors"
      searchPredicate={(author, query) =>
        [author.name, author.bio, author.status]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query))
      }
      tableClassName="min-w-[720px]"
    />
  );
}

function AuthorRow({
  author,
  visibleColumns,
}: {
  author: Author;
  visibleColumns: AuthorColumnVisibility;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mode, setMode] = useState<"detail" | "edit">("detail");
  const [isPending, startTransition] = useTransition();
  const updateAction = updateAuthorAction.bind(null, author.id);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      setMode("detail");
    }
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteAuthorAction(author.id);
      setIsDeleteOpen(false);
      setIsOpen(false);
    });
  }

  function stopRowEvent(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
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
          <TableCell className="font-medium">{author.name}</TableCell>
        ) : null}
        {visibleColumns.bio ? (
          <TableCell className="text-muted-foreground">
            <p className="max-w-md truncate">
              {author.bio || "No bio provided."}
            </p>
          </TableCell>
        ) : null}
        {visibleColumns.status ? (
          <TableCell>
            <Badge
              variant={author.status === "active" ? "success" : "secondary"}
            >
              {author.status}
            </Badge>
          </TableCell>
        ) : null}
        {visibleColumns.updated ? (
          <TableCell className="text-muted-foreground">
            {formatDate(author.updatedAt)}
          </TableCell>
        ) : null}
        {visibleColumns.actions ? (
          <TableCell
            className="text-right"
            onClick={stopRowEvent}
            onKeyDown={stopRowEvent}
          >
            <div className="flex justify-end gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Edit ${author.name}`}
                onClick={() => {
                  setMode("edit");
                  setIsOpen(true);
                }}
              >
                <Pencil />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${author.name}`}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={isPending}
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 />
              </Button>
            </div>
          </TableCell>
        ) : null}
      </TableRow>

      <DialogContent className="max-w-xl">
        {mode === "edit" ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit author</DialogTitle>
              <DialogDescription>
                Update the author profile and status.
              </DialogDescription>
            </DialogHeader>
            <AuthorForm
              action={updateAction}
              author={author}
              onCancel={() => setMode("detail")}
              submitLabel="Save changes"
            />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{author.name}</DialogTitle>
              <DialogDescription>Author details</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="mt-1 text-sm font-medium">{author.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Bio</p>
                <p className="mt-1 text-sm">
                  {author.bio || "No bio provided."}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Status</p>
                <div className="mt-1">
                  <Badge
                    variant={
                      author.status === "active" ? "success" : "secondary"
                    }
                  >
                    {author.status}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm">Created</p>
                  <p className="mt-1 text-sm">{formatDate(author.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Updated</p>
                  <p className="mt-1 text-sm">{formatDate(author.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete author?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{author.name}&quot;.
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
              Delete author
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

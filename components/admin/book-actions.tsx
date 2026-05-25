"use client";

import Link from "next/link";
import { useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { deleteBookAction } from "@/app/admin/books/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BookActionsProps = {
  bookId: string;
};

export function BookActions({ bookId }: BookActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm("Delete this book?");

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteBookAction(bookId);
    });
  }

  return (
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
        <DropdownMenuItem asChild>
          <Link href={`/admin/books/${bookId}/edit`}>
            <Pencil className="size-4" />
            Edit
          </Link>
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
  );
}

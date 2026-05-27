"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { BookCatalog } from "@/components/storefront/book-catalog";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/books";
import { useSavedBooks } from "./use-saved-books";

type SavedBooksPageProps = {
  books: Book[];
};

export function SavedBooksPage({ books }: SavedBooksPageProps) {
  const { isLoaded, savedBookIds } = useSavedBooks();
  const savedBooks = books.filter((book) => savedBookIds.has(book.id));

  return (
    <div className="grid gap-6">
      <header className="grid gap-3">
        <p className="text-muted-foreground text-sm font-medium">
          Reading list
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Saved books
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Keep track of books you want to revisit before buying.
            </p>
          </div>
          {isLoaded ? (
            <p className="text-muted-foreground text-sm">
              {savedBooks.length} saved
            </p>
          ) : null}
        </div>
      </header>

      {!isLoaded ? (
        <div className="bg-muted/40 flex min-h-52 items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Loading saved books...
          </p>
        </div>
      ) : savedBooks.length === 0 ? (
        <div className="bg-muted/40 flex min-h-72 items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="grid justify-items-center gap-4">
            <div className="grid size-12 place-items-center rounded-full border bg-background">
              <Heart className="size-5 text-red-600" />
            </div>
            <div className="grid gap-1">
              <p className="font-medium">No saved books yet</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                Save books from the catalog or book detail pages and they will
                appear here.
              </p>
            </div>
            <Button asChild>
              <Link href="/">Browse books</Link>
            </Button>
          </div>
        </div>
      ) : (
        <BookCatalog books={savedBooks} />
      )}
    </div>
  );
}

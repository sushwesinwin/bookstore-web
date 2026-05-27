"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { BackButton } from "@/components/storefront/back-button";
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
      <div className="-ml-1">
        <BackButton />
      </div>
      <header className="flex flex-row items-end justify-between gap-3">
        <div className="grid min-w-0 gap-1 sm:gap-2">
          <p className="text-muted-foreground text-xs font-medium sm:text-sm">
            Reading list
          </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Saved books
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Keep track of books you want to revisit before buying.
            </p>
        </div>
        {isLoaded ? (
          <p className="text-muted-foreground whitespace-nowrap text-sm">
            {savedBooks.length} saved
          </p>
        ) : null}
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
        <BookCatalog books={savedBooks} showSearch={false} />
      )}
    </div>
  );
}

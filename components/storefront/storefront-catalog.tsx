"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { BookCatalog } from "@/components/storefront/book-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Book } from "@/lib/books";

type StorefrontCatalogProps = {
  books: Book[];
};

export function StorefrontCatalog({ books }: StorefrontCatalogProps) {
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) => {
      return [book.title, book.author, book.description]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [books, query]);

  return (
    <div className="grid gap-8">
      <section className="grid justify-items-center gap-3">
        <form
          className="flex w-full max-w-2xl gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(searchValue);
          }}
        >
          <div className="relative min-w-0 flex-1">
            <Label htmlFor="book-search" className="sr-only">
              Search books
            </Label>
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="book-search"
              value={searchValue}
              onChange={(event) => {
                const nextValue = event.target.value;

                setSearchValue(nextValue);

                if (!nextValue) {
                  setQuery("");
                }
              }}
              placeholder="Search by title, author, or description"
              className="h-11 pl-9"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            aria-label="Search books"
            className="size-11 bg-red-600 text-white hover:bg-red-700"
          >
            <Search className="size-4" />
          </Button>
        </form>
        <p className="text-muted-foreground text-sm">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </section>

      <section id="catalog" className="grid gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Full catalog
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            All books
          </h2>
        </div>
        <BookCatalog
          books={filteredBooks}
          showSearch={false}
          showCount={false}
        />
      </section>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { BookCatalog } from "@/components/storefront/book-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Book } from "@/lib/books";
import type { Category } from "@/lib/categories";

type StorefrontCatalogProps = {
  books: Book[];
  categories?: Category[];
};

export function StorefrontCatalog({
  books,
  categories = [],
}: StorefrontCatalogProps) {
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory =
        !selectedCategoryId || book.categoryId === selectedCategoryId;
      const matchesQuery =
        !normalizedQuery ||
        [book.title, book.author, book.description]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [books, query, selectedCategoryId]);

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
        {categories.length > 0 ? (
          <div className="flex w-full flex-wrap items-center justify-start gap-2">
            <span className="text-muted-foreground mr-1 text-sm font-medium">
              Category:
            </span>
            <Button
              type="button"
              variant={selectedCategoryId ? "outline" : "default"}
              size="sm"
              onClick={() => setSelectedCategoryId("")}
              className="h-7 rounded-full px-3 text-xs font-medium lowercase"
            >
              all
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                type="button"
                variant={
                  selectedCategoryId === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategoryId(category.id)}
                className="h-7 rounded-full px-3 text-xs font-medium lowercase"
              >
                {category.name}
              </Button>
            ))}
          </div>
        ) : null}
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

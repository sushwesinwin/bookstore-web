"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getBookImageUrl, type Book } from "@/lib/books";

type BookCatalogProps = {
  books: Book[];
  showSearch?: boolean;
  showCount?: boolean;
};

export function BookCatalog({
  books,
  showSearch = true,
  showCount = true,
}: BookCatalogProps) {
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
    <div className="grid gap-6">
      {showSearch ? (
        <div className="relative max-w-2xl">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, author, or description"
            className="h-11 pl-9"
          />
        </div>
      ) : null}

      {showCount ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            Showing {filteredBooks.length} of {books.length} books
          </p>
        </div>
      ) : null}

      {filteredBooks.length === 0 ? (
        <div className="flex min-h-52 items-center justify-center rounded-lg border border-dashed bg-background p-8 text-center">
          <div>
            <p className="font-medium">No books found</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Try a different title, author, or keyword.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredBooks.map((book) => {
            const imageUrl = getBookImageUrl(book.imageUrl);

            return (
              <Card
                key={book.id}
                className="group overflow-hidden border-0 bg-transparent py-0 shadow-none"
              >
                <div className="bg-muted relative aspect-[3/4] overflow-hidden rounded-md border shadow-xs transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`${book.title} cover`}
                      fill
                      sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                      No cover
                    </div>
                  )}
                  {book.isBestSeller ? (
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      Best seller
                    </Badge>
                  ) : null}
                </div>
                <CardContent className="px-1 pt-2 pb-0">
                  <h2 className="text-xs leading-4 font-medium transition-colors group-hover:text-foreground">
                    {book.title}
                  </h2>
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                    by {book.author}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

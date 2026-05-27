"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, Search, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [savedBookIds, setSavedBookIds] = useState<Set<string>>(new Set());
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

  function toggleSaved(bookId: string) {
    setSavedBookIds((current) => {
      const nextSavedBookIds = new Set(current);

      if (nextSavedBookIds.has(bookId)) {
        nextSavedBookIds.delete(bookId);
      } else {
        nextSavedBookIds.add(bookId);
      }

      return nextSavedBookIds;
    });
  }

  async function shareBook(book: Book) {
    const url = `${window.location.origin}/books/${book.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: book.title,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
    } catch {
      // Sharing can be cancelled by the user; no visible error is needed here.
    }
  }

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
          {filteredBooks.map((book, index) => {
            const imageUrl = getBookImageUrl(book.imageUrl);
            const isFirstImage = index === 0;
            const isSaved = savedBookIds.has(book.id);

            return (
              <Card
                key={book.id}
                className="group relative overflow-visible border-0 bg-transparent py-0 shadow-none"
              >
                {book.isBestSeller ? (
                  <Badge className="absolute -top-2 -left-2 z-10 border-transparent bg-red-600 text-white shadow-sm hover:bg-red-600">
                    Best seller
                  </Badge>
                ) : null}
                <div className="relative transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <Link
                    href={`/books/${book.id}`}
                    aria-label={`View ${book.title}`}
                    className="block"
                  >
                    <div className="bg-muted relative aspect-[3/4] overflow-hidden rounded-md border shadow-xs">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={`${book.title} cover`}
                          fill
                          priority={isFirstImage}
                          loading={isFirstImage ? "eager" : "lazy"}
                          sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                          No cover
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="pointer-events-none absolute inset-x-2 top-2 z-20 flex items-center justify-between opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={isSaved ? "Remove from saved" : "Save book"}
                      aria-pressed={isSaved}
                      onClick={() => toggleSaved(book.id)}
                      className="pointer-events-auto size-8 rounded-full bg-background/95 shadow-sm backdrop-blur"
                    >
                      <Heart
                        className={
                          isSaved
                            ? "size-4 fill-red-600 text-red-600"
                            : "size-4"
                        }
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Share book"
                      onClick={() => shareBook(book)}
                      className="pointer-events-auto size-8 rounded-full bg-background/95 shadow-sm backdrop-blur"
                    >
                      <Share2 className="size-4" />
                    </Button>
                  </div>
                  <div className="pointer-events-none absolute bottom-2 left-2 z-20 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      aria-label={`View ${book.title}`}
                      className="pointer-events-auto h-8 rounded-full bg-background/95 px-3 text-xs shadow-sm backdrop-blur"
                    >
                      <Link href={`/books/${book.id}`}>
                        View
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#5985E1"
                          aria-hidden="true"
                          className="size-3.5"
                        >
                          <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                        </svg>
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardContent className="px-1 pt-2 pb-0">
                  <Link href={`/books/${book.id}`}>
                    <h2 className="text-xs leading-4 font-medium transition-colors group-hover:text-foreground hover:underline">
                      {book.title}
                    </h2>
                  </Link>
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

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BookActions } from "@/components/storefront/book-actions";
import { BookPurchaseCta } from "@/components/storefront/book-purchase-cta";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBook, getBookImageUrl, type Book } from "@/lib/books";

export const dynamic = "force-dynamic";

type BookDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(value: string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

async function loadBook(id: string): Promise<Book> {
  try {
    return await getBook(id);
  } catch {
    notFound();
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await loadBook(id);
  const imageUrl = getBookImageUrl(book.imageUrl);

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex items-start">
          <Button asChild variant="ghost" size="icon" className="-ml-2 size-9">
            <Link href="/" aria-label="Back to books">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[380px_minmax(0,1fr)]">
          <section className="grid grid-cols-[2.25rem_minmax(0,15rem)_2.25rem] items-start justify-center gap-3 sm:flex sm:justify-center lg:sticky lg:top-24 lg:self-start">
            <div className="size-9 sm:hidden" aria-hidden="true" />
            <div className="bg-muted relative aspect-[3/4] w-full max-w-60 min-w-0 rounded-lg border shadow-sm sm:max-w-72 lg:max-w-none lg:rounded-xl">
              <div className="relative h-full overflow-hidden rounded-lg">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${book.title} cover`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 288px, 240px"
                    className="object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    No cover
                  </div>
                )}
              </div>
              {book.isBestSeller ? (
                <div
                  aria-label="Best seller"
                  className="pointer-events-none absolute right-2 top-3 z-10 grid size-14 place-items-center rounded-full border border-white/70 bg-red-600 p-2 text-center text-[9px] font-bold uppercase leading-tight text-white shadow-lg sm:right-0 sm:top-4 sm:size-[4.5rem] sm:translate-x-1/3 sm:text-[10px]"
                >
                  <span>
                    Best
                    <br />
                    Seller
                  </span>
                </div>
              ) : null}
            </div>
            <BookActions
              bookId={book.id}
              bookTitle={book.title}
              className="sm:hidden"
            />
          </section>

          <section className="grid content-start gap-6 lg:pt-2">
            <div className="grid gap-4">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <h1 className="min-w-0 max-w-3xl flex-1 break-words text-center text-2xl font-semibold leading-tight tracking-tight sm:text-left sm:text-4xl lg:text-5xl">
                  {book.title}
                </h1>
                <BookActions
                  bookId={book.id}
                  bookTitle={book.title}
                  className="hidden sm:grid"
                />
              </div>
              <p className="text-muted-foreground text-center text-sm sm:text-left sm:text-base">
                by {book.author}
              </p>
              <div className="grid gap-2 lg:pt-2">
                <p className="text-muted-foreground max-w-3xl text-sm leading-6 sm:text-base sm:leading-7">
                  {book.description || "No description provided."}
                </p>
              </div>
            </div>

            <Card className="border-0 shadow-none sm:border sm:shadow-xs">
              <CardContent className="grid gap-4 p-4 sm:p-6 lg:p-7">
                <BookPurchaseCta
                  priceLabel={formatCurrency(book.price)}
                  stock={book.stock}
                />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

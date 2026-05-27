import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { BookActions } from "@/components/storefront/book-actions";
import { BookPurchaseCta } from "@/components/storefront/book-purchase-cta";
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
  const isAvailable = book.stock > 0;

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <div className="lg:col-span-2">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="text-muted-foreground flex items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="font-medium text-foreground transition-colors hover:text-red-600"
                >
                  Books
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4" />
              </li>
              <li className="min-w-0 truncate" aria-current="page">
                {book.title}
              </li>
            </ol>
          </nav>
        </div>
        <section className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-muted relative mx-auto aspect-[3/4] w-full max-w-80 rounded-lg border shadow-sm lg:max-w-none">
            <div className="relative h-full overflow-hidden rounded-lg">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${book.title} cover`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 360px, 100vw"
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
                className="pointer-events-none absolute right-0 top-4 z-10 grid size-16 translate-x-1/3 place-items-center rounded-md border border-white/70 bg-red-600 p-2 text-center text-[10px] font-bold uppercase leading-tight text-white shadow-lg sm:size-[4.5rem]"
              >
                <span>
                  Best
                  <br />
                  Seller
                </span>
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid content-start gap-7">
          <div className="grid gap-4">
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                  {book.title}
                </h1>
                <BookActions bookTitle={book.title} />
              </div>
              <p className="text-muted-foreground mt-2 text-base">
                by {book.author}
              </p>
              <p className="text-muted-foreground mt-5 max-w-3xl leading-7">
                {book.description || "No description provided."}
              </p>
              <div className="mt-6 grid gap-4">
                <div className="price-section border-b pb-4">
                  <p className="text-3xl font-bold tracking-tight text-red-600">
                    {formatCurrency(book.price)}
                  </p>
                </div>
                <div className="stock-section flex flex-col gap-2 border-b pb-4 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    <span className="font-semibold">Available stock:</span>{" "}
                    {book.stock.toLocaleString("en-US")}
                  </span>
                  <span className="text-muted-foreground sm:text-right">
                    <span className="text-foreground">Availability:</span>{" "}
                    <span className="font-normal">
                      {isAvailable
                        ? "Within 3-5 business days"
                        : "Currently unavailable"}
                    </span>
                  </span>
                </div>
                <BookPurchaseCta stock={book.stock} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

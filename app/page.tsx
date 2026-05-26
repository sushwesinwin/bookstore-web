import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { StorefrontCatalog } from "@/components/storefront/storefront-catalog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getBooks, type Book } from "@/lib/books";
import { getCategories, type Category } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function Home() {
  let books: Book[] = [];
  let categories: Category[] = [];
  let loadError = false;
  let categoryLoadError = false;

  try {
    books = await getBooks();
  } catch {
    loadError = true;
  }

  try {
    categories = await getCategories();
  } catch {
    categoryLoadError = true;
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span>The</span><span>Bookstore</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link className="text-foreground" href="/">
              Books
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="#new">
              New arrivals
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="#catalog"
            >
              Catalog
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header id="new" className="grid gap-3 pb-2">
          <p className="text-muted-foreground text-sm font-medium">
            Curated shelves
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
            Find your next read from our latest collection.
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Search the catalog by title, author, or keyword and browse books
            currently managed by the store.
          </p>
        </header>

        {loadError ? (
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200">
            <div className="flex gap-3">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <div>
                <AlertTitle>Books API is unavailable</AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  The bookstore loaded, but books could not be fetched.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ) : null}

        {categoryLoadError ? (
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200">
            <div className="flex gap-3">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <div>
                <AlertTitle>Categories API is unavailable</AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  Books loaded, but categories could not be fetched.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ) : null}

        <StorefrontCatalog
          books={books}
          categories={categories.filter(
            (category) => category.status === "active",
          )}
        />
      </div>
    </main>
  );
}

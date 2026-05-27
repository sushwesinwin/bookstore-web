import { TriangleAlert } from "lucide-react";

import { SavedBooksPage } from "@/components/storefront/saved-books-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getBooks, type Book } from "@/lib/books";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  let books: Book[] = [];
  let loadError = false;

  try {
    books = await getBooks();
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {loadError ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200">
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <AlertTitle>Books API is unavailable</AlertTitle>
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                Saved book IDs loaded, but book details could not be fetched.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ) : null}

      <SavedBooksPage books={books} />
    </div>
  );
}

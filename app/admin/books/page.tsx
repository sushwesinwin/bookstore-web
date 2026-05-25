import { TriangleAlert } from "lucide-react";

import { AddBookDialog } from "@/components/admin/add-book-dialog";
import { AdminShell } from "@/components/admin/admin-shell";
import { BooksTable } from "@/components/admin/books-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getBooks, type Book } from "@/lib/books";
import { getCategories, type Category } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
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
    <AdminShell active="books">
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Book management
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Books</h1>
        </div>

        <AddBookDialog categories={categories} />
      </header>

      {loadError ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200">
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <AlertTitle>Books API is unavailable</AlertTitle>
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                The management table loaded, but the book list could not be
                fetched.
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
                Books loaded, but category options could not be fetched.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ) : null}

      <BooksTable books={books} categories={categories} />
    </AdminShell>
  );
}

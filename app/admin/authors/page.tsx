import { TriangleAlert } from "lucide-react";

import { AddAuthorDialog } from "@/components/admin/add-author-dialog";
import { AdminShell } from "@/components/admin/admin-shell";
import { AuthorsTable } from "@/components/admin/authors-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getAuthors, type Author } from "@/lib/authors";

export const dynamic = "force-dynamic";

export default async function AdminAuthorsPage() {
  let authors: Author[] = [];
  let loadError = false;

  try {
    authors = await getAuthors();
  } catch {
    loadError = true;
  }

  return (
    <AdminShell active="authors">
      <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Author management
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Authors
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{authors.length} records</Badge>
          <AddAuthorDialog />
        </div>
      </header>

      {loadError ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200">
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <AlertTitle>Authors API is unavailable</AlertTitle>
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                The author table loaded, but author data could not be fetched.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ) : null}

      <AuthorsTable authors={authors} />
    </AdminShell>
  );
}

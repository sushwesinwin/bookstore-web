import { TriangleAlert } from "lucide-react";

import { AddCategoryDialog } from "@/components/admin/add-category-dialog";
import { AdminShell } from "@/components/admin/admin-shell";
import { CategoriesTable } from "@/components/admin/categories-table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCategories, type Category } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let categories: Category[] = [];
  let loadError = false;

  try {
    categories = await getCategories();
  } catch {
    loadError = true;
  }

  return (
    <AdminShell active="categories">
      <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Category management
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Categories
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{categories.length} records</Badge>
          <AddCategoryDialog />
        </div>
      </header>

      {loadError ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200">
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <AlertTitle>Categories API is unavailable</AlertTitle>
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                The category table loaded, but category data could not be
                fetched.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ) : null}

      <CategoriesTable categories={categories} />
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin/admin-shell";
import { BookForm } from "@/components/admin/book-form";
import { createBookAction } from "@/app/admin/books/actions";
import { getCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function NewBookPage() {
  const categories = await getCategories();

  return (
    <AdminShell active="books">
      <header className="border-b pb-6">
        <p className="text-muted-foreground text-sm font-medium">
          Book management
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Add book
        </h1>
      </header>

      <BookForm
        action={createBookAction}
        categories={categories}
        title="Book details"
        description="Create a new catalog record."
        submitLabel="Create book"
      />
    </AdminShell>
  );
}

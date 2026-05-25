import { notFound } from "next/navigation";

import { updateBookAction } from "@/app/admin/books/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { BookForm } from "@/components/admin/book-form";
import { getBook } from "@/lib/books";
import { getCategories } from "@/lib/categories";

type EditBookPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  const action = updateBookAction.bind(null, id);
  let book: Awaited<ReturnType<typeof getBook>>;
  const categories = await getCategories();

  try {
    book = await getBook(id);
  } catch {
    notFound();
  }

  return (
    <AdminShell active="books">
      <header className="border-b pb-6">
        <p className="text-muted-foreground text-sm font-medium">
          Book management
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Edit book
        </h1>
      </header>

      <BookForm
        action={action}
        book={book}
        categories={categories}
        title="Book details"
        description="Update catalog, pricing, and inventory information."
        submitLabel="Save changes"
      />
    </AdminShell>
  );
}

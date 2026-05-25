import Link from "next/link";
import {
  BookOpen,
  CircleDollarSign,
  LibraryBig,
  PackageCheck,
  TriangleAlert,
} from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBooks, type Book } from "@/lib/books";

export const dynamic = "force-dynamic";

function getDashboardStats(books: Book[]) {
  const totalInventory = books.reduce((sum, book) => sum + book.stock, 0);
  const inventoryValue = books.reduce(
    (sum, book) => sum + Number(book.price || 0) * book.stock,
    0,
  );
  const lowStockCount = books.filter((book) => book.stock <= 5).length;

  return [
    {
      label: "Book titles",
      value: books.length.toLocaleString("en-US"),
      detail: "Active catalog records",
      icon: LibraryBig,
    },
    {
      label: "Inventory",
      value: totalInventory.toLocaleString("en-US"),
      detail: "Copies available",
      icon: PackageCheck,
    },
    {
      label: "Stock value",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(inventoryValue),
      detail: "Based on current prices",
      icon: CircleDollarSign,
    },
    {
      label: "Needs attention",
      value: lowStockCount.toLocaleString("en-US"),
      detail: "Titles at 5 or fewer copies",
      icon: BookOpen,
    },
  ];
}

export default async function AdminDashboardPage() {
  let books: Book[] = [];
  let loadError = false;

  try {
    books = await getBooks();
  } catch {
    loadError = true;
  }

  const stats = getDashboardStats(books);

  return (
    <AdminShell active="dashboard">
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Admin dashboard
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Overview
          </h1>
        </div>

        <Button asChild>
          <Link href="/admin/books">Manage books</Link>
        </Button>
      </header>

      {loadError ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200">
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <AlertTitle>Books API is unavailable</AlertTitle>
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                Dashboard metrics are shown with empty values because books
                could not be fetched.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {stat.detail}
                  </p>
                </div>
                <div className="rounded-md border bg-background p-2">
                  <Icon className="text-muted-foreground size-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </AdminShell>
  );
}

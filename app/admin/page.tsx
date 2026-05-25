import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  CircleDollarSign,
  LayoutDashboard,
  LibraryBig,
  PackageCheck,
  Plus,
  TriangleAlert,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBooks, type Book } from "@/lib/books";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    active: false,
  },
  {
    label: "Books",
    href: "/admin",
    icon: BookMarked,
    active: true,
  },
];

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

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInventoryState(stock: number) {
  if (stock <= 0) {
    return { label: "Out of stock", variant: "warning" as const };
  }

  if (stock <= 5) {
    return { label: "Low stock", variant: "warning" as const };
  }

  return { label: "In stock", variant: "success" as const };
}

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
    <main className="min-h-screen bg-muted/30 lg:flex">
      <aside className="border-b bg-background lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col gap-6 px-4 py-5">
          <div className="px-2">
            <p className="text-sm font-semibold">Bookstore Admin</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Manage store operations
            </p>
          </div>

          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {adminNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex h-10 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Admin dashboard
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Books
            </h1>
          </div>

          <Button asChild>
            <Link href="/admin/books/new">
              <Plus />
              Add book
            </Link>
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label}>
                <CardContent className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {stat.value}
                    </p>
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

        {loadError ? (
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200">
            <div className="flex gap-3">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <div>
                <AlertTitle>Books API is unavailable</AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  The dashboard loaded, but the book list could not be fetched.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ) : null}

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Book catalog</CardTitle>
              <CardDescription>
                Manage inventory, pricing, and publishing metadata.
              </CardDescription>
            </div>
            <Badge variant="secondary">{books.length} records</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-muted-foreground h-24 text-center"
                    >
                      No books found.
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((book) => {
                    const inventory = getInventoryState(book.stock);

                    return (
                      <TableRow key={book.id}>
                        <TableCell>
                          <div className="max-w-80">
                            <p className="truncate font-medium">
                              {book.title}
                            </p>
                            {book.description ? (
                              <p className="text-muted-foreground mt-1 truncate text-xs">
                                {book.description}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {book.author}
                        </TableCell>
                        <TableCell>
                          <Badge variant={inventory.variant}>
                            {inventory.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(book.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {book.stock.toLocaleString("en-US")}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(book.updatedAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

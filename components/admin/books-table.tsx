import { BookActions } from "@/components/admin/book-actions";
import { Badge } from "@/components/ui/badge";
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
import { getBookImageUrl, type Book } from "@/lib/books";

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

type BooksTableProps = {
  books: Book[];
};

export function BooksTable({ books }: BooksTableProps) {
  return (
    <Card id="books">
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
              <TableHead className="w-16">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-muted-foreground h-24 text-center"
                >
                  No books found.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => {
                const inventory = getInventoryState(book.stock);
                const imageUrl = getBookImageUrl(book.imageUrl);

                return (
                  <TableRow key={book.id}>
                    <TableCell>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${book.title} cover`}
                          className="size-12 rounded-md border object-cover"
                        />
                      ) : (
                        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-md border text-xs">
                          No image
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-80">
                        <p className="truncate font-medium">{book.title}</p>
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
                    <TableCell className="text-right">
                      <BookActions book={book} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

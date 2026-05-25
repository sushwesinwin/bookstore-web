import { BookDetailDialog } from "@/components/admin/book-detail-dialog";
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
import type { Book } from "@/lib/books";

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-24 text-center"
                >
                  No books found.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => <BookDetailDialog key={book.id} book={book} />)
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

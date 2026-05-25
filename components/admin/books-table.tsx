import { BookDetailDialog } from "@/components/admin/book-detail-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Book } from "@/lib/books";
import type { Category } from "@/lib/categories";

type BooksTableProps = {
  books: Book[];
  categories: Category[];
};

export function BooksTable({ books, categories }: BooksTableProps) {
  return (
    <div id="books" className="w-full min-w-0 overflow-hidden">
      <Table className="min-w-[920px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
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
                colSpan={8}
                className="text-muted-foreground h-24 text-center"
              >
                No books found.
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <BookDetailDialog
                key={book.id}
                book={book}
                categories={categories}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

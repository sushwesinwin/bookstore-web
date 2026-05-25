import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getBookImageUrl, type Book } from "@/lib/books";

type BookFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  book?: Book;
  submitLabel: string;
  title: string;
  description: string;
};

export function BookForm({
  action,
  book,
  submitLabel,
  title,
  description,
}: BookFormProps) {
  const currentImageUrl = getBookImageUrl(book?.imageUrl);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={book?.title}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              defaultValue={book?.author}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={book?.description}
              rows={4}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={book?.price}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                defaultValue={book?.stock ?? 0}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={book?.imageUrl}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Upload image</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
            {currentImageUrl ? (
              <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-3">
                <img
                  src={currentImageUrl}
                  alt={book?.title ? `${book.title} cover` : "Book cover"}
                  className="size-16 rounded-md border object-cover"
                />
                <div>
                  <p className="text-sm font-medium">Current image</p>
                  <p className="text-muted-foreground max-w-96 truncate text-xs">
                    {book?.imageUrl}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" asChild>
              <Link href="/admin/books">Cancel</Link>
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

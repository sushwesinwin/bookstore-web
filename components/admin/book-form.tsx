"use client";

import Link from "next/link";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ImageUp } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getBookImageUrl, type Book } from "@/lib/books";
import type { Category } from "@/lib/categories";

type BookFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  book?: Book;
  categories?: Category[];
  cancelHref?: string;
  onCancel?: () => void;
  submitLabel: string;
  title: string;
  description: string;
};

export function BookForm({
  action,
  book,
  categories = [],
  cancelHref = "/admin/books",
  onCancel,
  submitLabel,
  title,
  description,
}: BookFormProps) {
  const imageInputId = useId();
  const categoryInputId = useId();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>();
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    book?.categoryId ?? "uncategorized",
  );
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

          <input
            type="hidden"
            name="author"
            value={book?.author ?? "Unknown"}
          />

          <div className="grid gap-2">
            <Label htmlFor={categoryInputId}>Category</Label>
            <input
              type="hidden"
              name="categoryId"
              value={
                selectedCategoryId === "uncategorized"
                  ? ""
                  : selectedCategoryId
              }
            />
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger id={categoryInputId} className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                    {category.status === "inactive" ? " (inactive)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/30 p-4">
            <div className="grid gap-1">
              <Label htmlFor="isBestSeller">Best seller</Label>
              <p className="text-muted-foreground text-sm">
                Feature this book in the public best-seller section.
              </p>
            </div>
            <Switch
              id="isBestSeller"
              name="isBestSeller"
              value="true"
              defaultChecked={book?.isBestSeller ?? false}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={imageInputId}>Cover image</Label>
            <label
              htmlFor={imageInputId}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDraggingImage(true);
              }}
              onDragLeave={() => setIsDraggingImage(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDraggingImage(false);

                if (imageInputRef.current && event.dataTransfer.files.length) {
                  imageInputRef.current.files = event.dataTransfer.files;
                  setSelectedImageName(event.dataTransfer.files[0]?.name);
                }
              }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-center transition-colors ${
                isDraggingImage
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <span className="bg-background flex size-10 items-center justify-center rounded-md border">
                <ImageUp className="text-muted-foreground size-5" />
              </span>
              <span className="text-sm font-medium">
                Drop an image here, or click to browse
              </span>
              <span className="text-muted-foreground text-xs">
                JPG, PNG, WebP, or GIF up to 5 MB
              </span>
              {selectedImageName ? (
                <span className="text-xs font-medium">{selectedImageName}</span>
              ) : null}
            </label>
            <Input
              ref={imageInputRef}
              id={imageInputId}
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                setSelectedImageName(event.target.files?.[0]?.name);
              }}
            />
            {currentImageUrl ? (
              <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-3">
                <Image
                  src={currentImageUrl}
                  alt={book?.title ? `${book.title} cover` : "Book cover"}
                  width={64}
                  height={64}
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
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={cancelHref}>Cancel</Link>
              </Button>
            )}
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

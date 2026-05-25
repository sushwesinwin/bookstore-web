"use client";

import Image from "next/image";
import { type FormEvent, useId, useRef, useState, useTransition } from "react";
import { ImageUp } from "lucide-react";

import type { CategoryActionResult } from "@/app/admin/categories/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCategoryImageUrl, type Category } from "@/lib/categories";

type CategoryFormProps = {
  action: (formData: FormData) => Promise<CategoryActionResult>;
  category?: Category;
  onCancel?: () => void;
  submitLabel: string;
};

export function CategoryForm({
  action,
  category,
  onCancel,
  submitLabel,
}: CategoryFormProps) {
  const imageInputId = useId();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>();
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const currentImageUrl = getCategoryImageUrl(category?.imageUrl);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(undefined);

      const result = await action(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      onCancel?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {error ? (
        <Alert className="border-red-200 bg-red-50 text-red-900">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={category?.name}
          placeholder="Fiction"
          required
        />
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/30 p-4">
        <div className="grid gap-1">
          <Label htmlFor="status">Active</Label>
          <p className="text-muted-foreground text-sm">
            Active categories can be shown on the storefront.
          </p>
        </div>
        <Switch
          id="status"
          name="status"
          value="active"
          defaultChecked={category?.status !== "inactive"}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={imageInputId}>Category image</Label>
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
            JPG, PNG, WebP, GIF, or SVG up to 5 MB
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
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
          className="sr-only"
          onChange={(event) => {
            setSelectedImageName(event.target.files?.[0]?.name);
          }}
        />
        {currentImageUrl ? (
          <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-3">
            <Image
              src={currentImageUrl}
              alt={category?.name ? `${category.name} category` : "Category"}
              width={64}
              height={64}
              className="size-16 rounded-md border object-cover"
            />
            <div>
              <p className="text-sm font-medium">Current image</p>
              <p className="text-muted-foreground max-w-96 truncate text-xs">
                {category?.imageUrl}
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
        ) : null}
        <Button type="submit" disabled={isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

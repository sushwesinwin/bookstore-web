"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ImageUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCategoryImageUrl, type Category } from "@/lib/categories";

type CategoryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
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
  const currentImageUrl = getCategoryImageUrl(category?.imageUrl);

  return (
    <form action={action} className="grid gap-5">
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
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

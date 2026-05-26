"use client";

import { type FormEvent, useState, useTransition } from "react";

import type { CategoryActionResult } from "@/app/admin/categories/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Category } from "@/lib/categories";

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
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createBook,
  deleteBook,
  updateBook,
  uploadBookImage,
  type CreateBookInput,
} from "@/lib/books";

function optionalString(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";

  return text.length > 0 ? text : undefined;
}

async function parseBookForm(formData: FormData): Promise<CreateBookInput> {
  const title = optionalString(formData.get("title"));
  const author = optionalString(formData.get("author"));
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock") ?? 0);
  const image = formData.get("image");
  const uploadedImageUrl =
    image instanceof File && image.size > 0
      ? await uploadBookImage(image)
      : undefined;

  if (!title || !author || Number.isNaN(price)) {
    throw new Error("Title, author, and price are required.");
  }

  return {
    title,
    author,
    description: optionalString(formData.get("description")),
    price,
    stock: Number.isNaN(stock) ? 0 : stock,
    imageUrl: uploadedImageUrl ?? optionalString(formData.get("imageUrl")),
  };
}

export async function createBookAction(formData: FormData) {
  await createBook(await parseBookForm(formData));
  revalidatePath("/admin");
  revalidatePath("/admin/books");
  redirect("/admin/books");
}

export async function updateBookAction(id: string, formData: FormData) {
  await updateBook(id, await parseBookForm(formData));
  revalidatePath("/admin");
  revalidatePath("/admin/books");
  redirect("/admin/books");
}

export async function deleteBookAction(id: string) {
  await deleteBook(id);
  revalidatePath("/admin");
  revalidatePath("/admin/books");
}

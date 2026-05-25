"use server";

import { revalidatePath } from "next/cache";

import {
  createCategory,
  deleteCategory,
  updateCategory,
  updateCategoryStatus,
  uploadCategoryImage,
  type CategoryStatus,
  type CreateCategoryInput,
} from "@/lib/categories";

function optionalString(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";

  return text.length > 0 ? text : undefined;
}

function parseStatus(formData: FormData): CategoryStatus {
  return formData.get("status") === "active" ? "active" : "inactive";
}

async function parseCategoryForm(
  formData: FormData,
): Promise<CreateCategoryInput> {
  const name = optionalString(formData.get("name"));
  const image = formData.get("image");
  const uploadedImageUrl =
    image instanceof File && image.size > 0
      ? await uploadCategoryImage(image)
      : undefined;

  if (!name) {
    throw new Error("Category name is required.");
  }

  return {
    name,
    imageUrl: uploadedImageUrl,
    status: parseStatus(formData),
  };
}

export async function createCategoryAction(formData: FormData) {
  await createCategory(await parseCategoryForm(formData));
  revalidatePath("/admin/categories");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await updateCategory(id, await parseCategoryForm(formData));
  revalidatePath("/admin/categories");
}

export async function updateCategoryStatusAction(
  id: string,
  formData: FormData,
) {
  await updateCategoryStatus(id, parseStatus(formData));
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
  revalidatePath("/admin/categories");
}

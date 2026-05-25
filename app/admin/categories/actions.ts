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

export type CategoryActionResult = {
  error?: string;
};

function optionalString(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";

  return text.length > 0 ? text : undefined;
}

function getActionErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: unknown;
          };
        };
      }
    ).response;
    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

function parseStatus(formData: FormData): CategoryStatus {
  return formData.get("status") === "active" ? "active" : "inactive";
}

async function parseCategoryForm(
  formData: FormData,
): Promise<CreateCategoryInput> {
  const name = optionalString(formData.get("name"));

  if (!name) {
    throw new Error("Category name is required.");
  }

  const image = formData.get("image");
  const uploadedImageUrl =
    image instanceof File && image.size > 0
      ? await uploadCategoryImage(image)
      : undefined;

  return {
    name,
    imageUrl: uploadedImageUrl,
    status: parseStatus(formData),
  };
}

export async function createCategoryAction(
  formData: FormData,
): Promise<CategoryActionResult> {
  try {
    await createCategory(await parseCategoryForm(formData));
    revalidatePath("/admin/categories");
    return {};
  } catch (error) {
    return { error: getActionErrorMessage(error) };
  }
}

export async function updateCategoryAction(
  id: string,
  formData: FormData,
): Promise<CategoryActionResult> {
  try {
    await updateCategory(id, await parseCategoryForm(formData));
    revalidatePath("/admin/categories");
    return {};
  } catch (error) {
    return { error: getActionErrorMessage(error) };
  }
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

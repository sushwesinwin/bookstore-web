"use server";

import { revalidatePath } from "next/cache";

import {
  createAuthor,
  deleteAuthor,
  updateAuthor,
  updateAuthorStatus,
  type AuthorStatus,
  type CreateAuthorInput,
} from "@/lib/authors";

export type AuthorActionResult = {
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

function parseStatus(formData: FormData): AuthorStatus {
  return formData.get("status") === "active" ? "active" : "inactive";
}

async function parseAuthorForm(formData: FormData): Promise<CreateAuthorInput> {
  const name = optionalString(formData.get("name"));

  if (!name) {
    throw new Error("Author name is required.");
  }

  return {
    name,
    bio: optionalString(formData.get("bio")) ?? null,
    status: parseStatus(formData),
  };
}

export async function createAuthorAction(
  formData: FormData,
): Promise<AuthorActionResult> {
  try {
    await createAuthor(await parseAuthorForm(formData));
    revalidatePath("/admin/authors");
    return {};
  } catch (error) {
    return { error: getActionErrorMessage(error) };
  }
}

export async function updateAuthorAction(
  id: string,
  formData: FormData,
): Promise<AuthorActionResult> {
  try {
    await updateAuthor(id, await parseAuthorForm(formData));
    revalidatePath("/admin/authors");
    return {};
  } catch (error) {
    return { error: getActionErrorMessage(error) };
  }
}

export async function updateAuthorStatusAction(id: string, formData: FormData) {
  await updateAuthorStatus(id, parseStatus(formData));
  revalidatePath("/admin/authors");
}

export async function deleteAuthorAction(id: string) {
  await deleteAuthor(id);
  revalidatePath("/admin/authors");
}

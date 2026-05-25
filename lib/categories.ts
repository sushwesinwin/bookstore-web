import { api } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CategoryStatus = "active" | "inactive";

export type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  name: string;
  imageUrl?: string;
  status?: CategoryStatus;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

type UploadImageResponse = {
  imageUrl: string;
};

export function getCategoryImageUrl(imageUrl?: string) {
  if (!imageUrl) {
    return undefined;
  }

  if (/^(https?:)?\/\//.test(imageUrl) || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  if (!API_URL) {
    return imageUrl;
  }

  const baseUrl = API_URL.replace(/\/$/, "");
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  return `${baseUrl}${path}`;
}

export async function getCategories() {
  const res = await api.get<Category[]>("/categories");
  return res.data;
}

export async function createCategory(data: CreateCategoryInput) {
  const res = await api.post<Category>("/categories", data);
  return res.data;
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const res = await api.patch<Category>(`/categories/${id}`, data);
  return res.data;
}

export async function updateCategoryStatus(id: string, status: CategoryStatus) {
  const res = await api.patch<Category>(`/categories/${id}/status`, {
    status,
  });
  return res.data;
}

export async function uploadCategoryImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post<UploadImageResponse>("/uploads/images", formData);
  return res.data.imageUrl;
}

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`);
}

import { api } from "./api";

export type CategoryStatus = "active" | "inactive";

export type Category = {
  id: string;
  name: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  name: string;
  status?: CategoryStatus;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

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

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`);
}

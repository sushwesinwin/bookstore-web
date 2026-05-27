import { api } from "./api";

export type AuthorStatus = "active" | "inactive";

export type Author = {
  id: string;
  name: string;
  bio?: string | null;
  status: AuthorStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateAuthorInput = {
  name: string;
  bio?: string | null;
  status?: AuthorStatus;
};

export type UpdateAuthorInput = Partial<CreateAuthorInput>;

export async function getAuthors() {
  const res = await api.get<Author[]>("/authors");
  return res.data;
}

export async function createAuthor(data: CreateAuthorInput) {
  const res = await api.post<Author>("/authors", data);
  return res.data;
}

export async function updateAuthor(id: string, data: UpdateAuthorInput) {
  const res = await api.patch<Author>(`/authors/${id}`, data);
  return res.data;
}

export async function updateAuthorStatus(id: string, status: AuthorStatus) {
  const res = await api.patch<Author>(`/authors/${id}/status`, {
    status,
  });
  return res.data;
}

export async function deleteAuthor(id: string) {
  await api.delete(`/authors/${id}`);
}

import { api } from './api';
import type { Category } from './categories';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Book = {
    id: string;
    title: string;
    author: string;
    description?: string;
    price: string;
    stock: number;
    imageUrl?: string;
    categoryId?: string | null;
    category?: Category | null;
    isBestSeller: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateBookInput = {
    title: string;
    author: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    categoryId?: string | null;
    isBestSeller?: boolean;
};

export type UpdateBookInput = CreateBookInput;

type UploadImageResponse = {
    imageUrl: string;
};

export function getBookImageUrl(imageUrl?: string) {
    if (!imageUrl) {
        return undefined;
    }

    if (/^(https?:)?\/\//.test(imageUrl) || imageUrl.startsWith('data:')) {
        return imageUrl;
    }

    if (!API_URL) {
        return imageUrl;
    }

    const baseUrl = API_URL.replace(/\/$/, '');
    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

    return `${baseUrl}${path}`;
}

export async function getBooks() {
    const res = await api.get<Book[]>('/books');
    return res.data;
}

export async function getBook(id: string) {
    const res = await api.get<Book>(`/books/${id}`);
    return res.data;
}

export async function createBook(data: CreateBookInput) {
    const res = await api.post<Book>('/books', data);
    return res.data;
}

export async function uploadBookImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post<UploadImageResponse>('/uploads/images', formData);
    return res.data.imageUrl;
}

export async function updateBook(id: string, data: UpdateBookInput) {
    const res = await api.patch<Book>(`/books/${id}`, data);
    return res.data;
}

export async function deleteBook(id: string) {
    await api.delete(`/books/${id}`);
}

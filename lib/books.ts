import { api } from './api';

export type Book = {
    id: string;
    title: string;
    author: string;
    description?: string;
    price: string;
    stock: number;
    imageUrl?: string;
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
};

export async function getBooks() {
    const res = await api.get<Book[]>('/books');
    return res.data;
}

export async function createBook(data: CreateBookInput) {
    const res = await api.post<Book>('/books', data);
    return res.data;
}

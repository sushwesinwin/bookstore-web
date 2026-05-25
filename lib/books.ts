import { api } from './api';

export async function getBooks() {
    const res = await api.get('/books');
    return res.data;
}
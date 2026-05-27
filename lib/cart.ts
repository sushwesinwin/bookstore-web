import { api } from "./api";
import type { Book } from "./books";

export type CartItem = {
  id: string;
  cartId: string;
  bookId: string;
  quantity: number;
  book: Book;
  createdAt: string;
  updatedAt: string;
};

export type Cart = {
  id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export async function createCart() {
  const res = await api.post<Cart>("/cart");
  return res.data;
}

export async function getCart(id: string) {
  const res = await api.get<Cart>(`/cart/${id}`);
  return res.data;
}

export async function addCartItem(
  id: string,
  data: {
    bookId: string;
    quantity: number;
  },
) {
  const res = await api.post<Cart>(`/cart/${id}/items`, data);
  return res.data;
}

export async function updateCartItem(
  id: string,
  itemId: string,
  data: {
    quantity: number;
  },
) {
  const res = await api.patch<Cart>(`/cart/${id}/items/${itemId}`, data);
  return res.data;
}

export async function removeCartItem(id: string, itemId: string) {
  const res = await api.delete<Cart>(`/cart/${id}/items/${itemId}`);
  return res.data;
}

export async function clearCart(id: string) {
  const res = await api.delete<Cart>(`/cart/${id}/items`);
  return res.data;
}

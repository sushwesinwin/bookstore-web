"use client";

import { useCallback, useEffect, useState } from "react";

import {
  addCartItem,
  clearCart as clearCartRequest,
  createCart,
  getCart,
  removeCartItem,
  updateCartItem,
  type Cart,
} from "@/lib/cart";

const CART_ID_KEY = "bookstore:cart-id";
const CART_CHANGE_EVENT = "bookstore:cart-change";

function readCartId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(CART_ID_KEY);
}

function writeCartId(cartId: string) {
  window.localStorage.setItem(CART_ID_KEY, cartId);
}

function clearCartId() {
  window.localStorage.removeItem(CART_ID_KEY);
}

function dispatchCartChange() {
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data
  ) {
    const message = error.response.data.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "Cart action failed";
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCart = useCallback(async () => {
    const cartId = readCartId();

    if (!cartId) {
      setCart(null);
      setIsLoaded(true);
      return null;
    }

    try {
      const nextCart = await getCart(cartId);
      setCart(nextCart);
      setErrorMessage("");
      return nextCart;
    } catch {
      clearCartId();
      setCart(null);
      return null;
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    function syncCart() {
      void loadCart();
    }

    const loadTimer = window.setTimeout(syncCart, 0);

    window.addEventListener("storage", syncCart);
    window.addEventListener(CART_CHANGE_EVENT, syncCart);

    return () => {
      window.clearTimeout(loadTimer);
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CART_CHANGE_EVENT, syncCart);
    };
  }, [loadCart]);

  const ensureCart = useCallback(async () => {
    const cartId = readCartId();

    if (cartId) {
      try {
        const existingCart = await getCart(cartId);
        setCart(existingCart);
        return existingCart;
      } catch {
        clearCartId();
      }
    }

    const nextCart = await createCart();
    writeCartId(nextCart.id);
    setCart(nextCart);
    return nextCart;
  }, []);

  const addBookToCart = useCallback(
    async (bookId: string, quantity: number) => {
      setIsMutating(true);
      setErrorMessage("");

      try {
        const currentCart = await ensureCart();
        const nextCart = await addCartItem(currentCart.id, {
          bookId,
          quantity,
        });

        setCart(nextCart);
        dispatchCartChange();
        return nextCart;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [ensureCart],
  );

  const changeItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!cart) {
        return null;
      }

      setIsMutating(true);
      setErrorMessage("");

      try {
        const nextCart = await updateCartItem(cart.id, itemId, { quantity });
        setCart(nextCart);
        dispatchCartChange();
        return nextCart;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [cart],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!cart) {
        return null;
      }

      setIsMutating(true);
      setErrorMessage("");

      try {
        const nextCart = await removeCartItem(cart.id, itemId);
        setCart(nextCart);
        dispatchCartChange();
        return nextCart;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [cart],
  );

  const clearCart = useCallback(async () => {
    if (!cart) {
      return null;
    }

    setIsMutating(true);
    setErrorMessage("");

    try {
      const nextCart = await clearCartRequest(cart.id);
      setCart(nextCart);
      dispatchCartChange();
      return nextCart;
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsMutating(false);
    }
  }, [cart]);

  return {
    addBookToCart,
    cart,
    changeItemQuantity,
    clearCart,
    errorMessage,
    isLoaded,
    isMutating,
    itemCount:
      cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0,
    removeItem,
  };
}

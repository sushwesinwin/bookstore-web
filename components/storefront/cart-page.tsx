"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBookImageUrl } from "@/lib/books";
import type { CartItem } from "@/lib/cart";
import { useCart } from "./use-cart";

const EMPTY_CART_ITEMS: CartItem[] = [];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function getBookPrice(value: string) {
  const amount = Number(value);

  return Number.isNaN(amount) ? 0 : amount;
}

function DeliveryTruckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="#5985E1"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path d="M195-195q-35-35-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35q-50 0-85-35Zm442-245h193l4-21-74-99h-95l-28 120Zm-19-273 2-7-84 360 2-7 34-146 46-200ZM20-427l20-80h220l-20 80H20Zm80-146 20-80h260l-20 80H100Zm180 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z" />
    </svg>
  );
}

type CartItemRowProps = {
  item: CartItem;
  isMutating: boolean;
  onChangeQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
};

function CartItemRow({
  item,
  isMutating,
  onChangeQuantity,
  onRemoveItem,
}: CartItemRowProps) {
  const imageUrl = getBookImageUrl(item.book.imageUrl);
  const unitPrice = getBookPrice(item.book.price);
  const itemTotal = unitPrice * item.quantity;
  const maxQuantity = Math.max(item.book.stock, 1);

  return (
    <article className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 rounded-lg border bg-background p-3 shadow-xs sm:grid-cols-[96px_minmax(0,1fr)] sm:p-4">
      <Link
        href={`/books/${item.book.id}`}
        className="bg-muted relative aspect-[3/4] overflow-hidden rounded-md border"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${item.book.title} cover`}
            fill
            sizes="(min-width: 640px) 96px, 76px"
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            No cover
          </div>
        )}
      </Link>

      <div className="grid min-w-0 gap-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <Link href={`/books/${item.book.id}`}>
              <h2 className="line-clamp-2 font-medium leading-snug hover:underline">
                {item.book.title}
              </h2>
            </Link>
            <p className="text-muted-foreground mt-1 text-sm">
              by {item.book.author}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                Stock: {item.book.stock.toLocaleString("en-US")}
              </Badge>
              <span className="text-muted-foreground text-xs">
                Unit {formatCurrency(unitPrice)}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Item total
            </p>
            <p className="mt-1 font-semibold text-red-600">
              {formatCurrency(itemTotal)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center rounded-full bg-muted/40 p-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1 || isMutating}
              onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
              className="size-8 rounded-full bg-background shadow-none"
            >
              <Minus className="size-4" />
            </Button>
            <span className="min-w-10 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase quantity"
              disabled={item.quantity >= maxQuantity || isMutating}
              onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
              className="size-8 rounded-full bg-background shadow-none"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onRemoveItem(item.id)}
            disabled={isMutating}
            className="text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="size-4" />
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}

export function CartPage() {
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const {
    cart,
    changeItemQuantity,
    clearCart,
    errorMessage,
    isLoaded,
    isMutating,
    removeItem,
  } = useCart();
  const items = cart?.items ?? EMPTY_CART_ITEMS;
  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + getBookPrice(item.book.price) * item.quantity;
    }, 0);
  }, [items]);
  const estimatedTax = subtotal * 0.05;
  const total = subtotal + estimatedTax;
  const itemCount = items.reduce((totalCount, item) => {
    return totalCount + item.quantity;
  }, 0);

  async function confirmClearCart() {
    try {
      await clearCart();
      setIsClearDialogOpen(false);
    } catch {
      // The hook surfaces the API error in the order summary.
    }
  }

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-2">
          <p className="text-muted-foreground text-sm font-medium">
            Shopping cart
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Cart
          </h1>
        </div>
        {items.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsClearDialogOpen(true)}
            disabled={isMutating}
          >
            <Trash2 className="size-4" />
            Clear cart
          </Button>
        ) : null}
      </header>

      {!isLoaded ? (
        <div className="bg-muted/40 flex min-h-52 items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">Loading cart...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-muted/40 flex min-h-72 items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="grid justify-items-center gap-4">
            <div className="grid size-12 place-items-center rounded-full border bg-background">
              <ShoppingCart className="size-5 text-red-600" />
            </div>
            <div className="grid gap-1">
              <p className="font-medium">Your cart is empty</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                Add books from their detail pages and they will appear here.
              </p>
            </div>
            <Button asChild>
              <Link href="/">Browse books</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="grid content-start gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Items</h2>
              <p className="text-muted-foreground text-sm">
                {itemCount.toLocaleString("en-US")}{" "}
                {itemCount === 1 ? "copy" : "copies"}
              </p>
            </div>
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                isMutating={isMutating}
                onChangeQuantity={(itemId, quantity) => {
                  void changeItemQuantity(itemId, quantity);
                }}
                onRemoveItem={(itemId) => {
                  void removeItem(itemId);
                }}
              />
            ))}
          </section>

          <aside className="self-start rounded-lg border bg-background shadow-lg shadow-black/10 lg:sticky lg:top-20">
            <div className="flex min-h-80 flex-col p-5 lg:p-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Order summary
                </h2>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium leading-4 text-foreground">
                  <DeliveryTruckIcon />
                  <span>We dispatch in 3-5 business days</span>
                </div>
              </div>

              <div className="mt-9 grid gap-4 text-sm">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                  <span className="text-muted-foreground">Items</span>
                  <span className="text-right">
                    {itemCount.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-right">{formatCurrency(subtotal)}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                  <span className="text-muted-foreground">Estimated tax</span>
                  <span className="text-right">
                    {formatCurrency(estimatedTax)}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-3">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-t pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-right text-red-600">
                    {formatCurrency(total)}
                  </span>
                </div>
                <Button type="button" className="mt-5 h-11 w-full">
                  Go to checkout
                </Button>
                {errorMessage ? (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      )}
      </div>

      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clear cart?</DialogTitle>
            <DialogDescription>
              This will remove all books from your cart.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isMutating}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={isMutating}
              onClick={() => void confirmClearCart()}
            >
              {isMutating ? "Clearing..." : "Clear cart"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

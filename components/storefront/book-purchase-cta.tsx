"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

type BookPurchaseCtaProps = {
  priceLabel: string;
  stock: number;
};

export function BookPurchaseCta({ priceLabel, stock }: BookPurchaseCtaProps) {
  const maxQuantity = Math.max(stock, 0);
  const [quantity, setQuantity] = useState(maxQuantity > 0 ? 1 : 0);
  const [cartMessage, setCartMessage] = useState("");

  function decrementQuantity() {
    setCartMessage("");
    setQuantity((current) => Math.max(current - 1, maxQuantity > 0 ? 1 : 0));
  }

  function incrementQuantity() {
    setCartMessage("");
    setQuantity((current) => Math.min(current + 1, maxQuantity));
  }

  function addToCart() {
    setCartMessage(`${quantity} ${quantity === 1 ? "copy" : "copies"} added`);
  }

  return (
    <>
      <div
        className="h-[calc(8.5rem+env(safe-area-inset-bottom))] sm:hidden"
        aria-hidden="true"
      />
      <div className="fixed inset-x-0 bottom-0 z-50 grid gap-3 rounded-t-3xl bg-background/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.12)] backdrop-blur sm:static sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <div className="mx-auto grid w-full max-w-7xl gap-3 rounded-lg bg-card p-3 sm:mx-0 sm:max-w-none sm:p-0">
          <div className="flex items-center justify-between gap-4 sm:border-b sm:pb-4">
            <p className="min-w-0 text-sm">
              <span className="font-semibold">Available stock:</span>{" "}
              <span className="text-muted-foreground">
                {stock.toLocaleString("en-US")}
              </span>
            </p>
            <p className="shrink-0 text-xl font-bold tracking-tight text-red-600 sm:text-2xl">
              {priceLabel}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-32 shrink-0 items-center justify-between rounded-md bg-muted/40 p-1 sm:w-36">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={decrementQuantity}
                className="size-9"
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-10 text-center text-sm font-semibold">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Increase quantity"
                disabled={quantity >= maxQuantity}
                onClick={incrementQuantity}
                className="size-9"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <Button
              type="button"
              disabled={quantity === 0}
              onClick={addToCart}
              className="h-11 flex-1 sm:h-12"
            >
              <ShoppingCart className="size-4" />
              Add to cart
            </Button>
          </div>
        </div>

        {cartMessage ? (
          <p className="mx-auto w-full max-w-7xl text-sm font-medium text-red-600 sm:mx-0 sm:max-w-none">
            {cartMessage}
          </p>
        ) : null}
      </div>
    </>
  );
}

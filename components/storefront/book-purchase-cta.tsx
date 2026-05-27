"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

type BookPurchaseCtaProps = {
  stock: number;
};

export function BookPurchaseCta({ stock }: BookPurchaseCtaProps) {
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
    <div className="grid gap-3 border-b pb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex w-fit items-center rounded-md border bg-background p-1">
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
          <span className="min-w-12 text-center text-sm font-semibold">
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
          className="h-11 w-full sm:w-48"
        >
          <ShoppingCart className="size-4" />
          Add to cart
        </Button>

      </div>

      {cartMessage ? (
        <p className="text-sm font-medium text-red-600">{cartMessage}</p>
      ) : null}
    </div>
  );
}

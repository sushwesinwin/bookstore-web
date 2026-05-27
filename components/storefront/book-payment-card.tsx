"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BookPaymentCardProps = {
  bookTitle: string;
  price: string;
  stock: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function BookPaymentCard({
  bookTitle,
  price,
  stock,
}: BookPaymentCardProps) {
  const unitPrice = Number(price);
  const safeUnitPrice = Number.isNaN(unitPrice) ? 0 : unitPrice;
  const maxQuantity = Math.max(stock, 0);
  const [quantity, setQuantity] = useState(maxQuantity > 0 ? 1 : 0);
  const [cartMessage, setCartMessage] = useState("");

  const totals = useMemo(() => {
    const subtotal = safeUnitPrice * quantity;
    const estimatedTax = subtotal * 0.05;
    const total = subtotal + estimatedTax;

    return {
      estimatedTax,
      subtotal,
      total,
    };
  }, [quantity, safeUnitPrice]);

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
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Add to cart</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{bookTitle}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {maxQuantity > 0
                  ? `${maxQuantity.toLocaleString("en-US")} available`
                  : "Currently unavailable"}
              </p>
            </div>
            <p className="text-muted-foreground text-xs">
              {formatCurrency(safeUnitPrice)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex items-center rounded-full bg-muted/40 p-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={decrementQuantity}
                className="size-8 rounded-full bg-background shadow-none"
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Increase quantity"
                disabled={quantity >= maxQuantity}
                onClick={incrementQuantity}
                className="size-8 rounded-full bg-background shadow-none"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-2 border-y py-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Estimated tax</span>
            <span>{formatCurrency(totals.estimatedTax)}</span>
          </div>
          <div className="flex justify-between gap-4 pt-2 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>

        <Button
          type="button"
          disabled={quantity === 0}
          onClick={addToCart}
          className="h-11 w-full"
        >
          <ShoppingCart className="size-4" />
          Add to cart
        </Button>

        {cartMessage ? (
          <p className="text-center text-sm font-medium text-red-600">
            {cartMessage}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

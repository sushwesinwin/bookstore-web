"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Banknote, CreditCard, LockKeyhole, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getBookImageUrl } from "@/lib/books";
import type { CartItem } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { BackButton } from "./back-button";
import { useCart } from "./use-cart";

type PaymentMethod = "stripe" | "cod";

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

export function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("stripe");
  const [statusMessage, setStatusMessage] = useState("");
  const { cart, isLoaded } = useCart();
  const items = cart?.items ?? EMPTY_CART_ITEMS;
  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + getBookPrice(item.book.price) * item.quantity;
    }, 0);
  }, [items]);
  const estimatedTax = subtotal * 0.05;
  const total = subtotal + estimatedTax;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(
      paymentMethod === "stripe"
        ? "Stripe checkout is selected. Connect the payment endpoint to continue payment processing."
        : "Cash on delivery is selected. Connect the order endpoint to place this order.",
    );
  }

  if (!isLoaded) {
    return (
      <div className="mx-auto grid min-h-[60vh] w-full max-w-7xl place-items-center px-4 py-8">
        <p className="text-muted-foreground text-sm">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <BackButton />
        <div className="bg-muted/40 flex min-h-72 items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="grid justify-items-center gap-4">
            <div className="grid size-12 place-items-center rounded-full border bg-background">
              <ShoppingCart className="size-5 text-red-600" />
            </div>
            <div className="grid gap-1">
              <p className="font-medium">Your cart is empty</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                Add books before going to checkout.
              </p>
            </div>
            <Button asChild>
              <Link href="/">Browse books</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 px-3 py-5 sm:gap-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="-ml-1">
        <BackButton />
      </div>

      <header className="grid gap-1">
        <p className="text-muted-foreground text-xs font-medium sm:text-sm">
          Checkout
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Complete your order
        </h1>
      </header>

      <form
        className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6"
        onSubmit={handleSubmit}
      >
        <section className="grid content-start gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Delivery details</CardTitle>
              <CardDescription>
                Enter the contact information for this order.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="checkout-name">Full name</Label>
                  <Input id="checkout-name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-phone">Phone</Label>
                  <Input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkout-email">Email</Label>
                <Input
                  id="checkout-email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkout-address">Delivery address</Label>
                <Textarea id="checkout-address" name="address" required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
              <CardDescription>
                Choose how the customer will pay for this order.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <PaymentOption
                checked={paymentMethod === "stripe"}
                description="Pay online with a card through Stripe."
                icon={<CreditCard className="size-5" />}
                label="Stripe"
                name="payment-method"
                onChange={() => setPaymentMethod("stripe")}
                value="stripe"
              />
              <PaymentOption
                checked={paymentMethod === "cod"}
                description="Collect payment when the books are delivered."
                icon={<Banknote className="size-5" />}
                label="Cash on delivery"
                name="payment-method"
                onChange={() => setPaymentMethod("cod")}
                value="cod"
              />
            </CardContent>
          </Card>
        </section>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Order summary</CardTitle>
                <Badge variant="outline">
                  {items.reduce((count, item) => count + item.quantity, 0)}{" "}
                  items
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid max-h-80 gap-3 overflow-auto pr-1">
                {items.map((item) => {
                  const imageUrl = getBookImageUrl(item.book.imageUrl);

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[52px_minmax(0,1fr)_auto] gap-3"
                    >
                      <div className="bg-muted relative aspect-[3/4] overflow-hidden rounded-md border">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={`${item.book.title} cover`}
                            fill
                            sizes="52px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium">
                          {item.book.title}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatCurrency(
                          getBookPrice(item.book.price) * item.quantity,
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-3 border-t pt-4 text-sm">
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <span className="text-muted-foreground">Estimated tax</span>
                  <span>{formatCurrency(estimatedTax)}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4 border-t pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-red-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button type="submit" className="h-11 w-full">
                {paymentMethod === "stripe"
                  ? "Continue to Stripe"
                  : "Place COD order"}
              </Button>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <LockKeyhole className="size-3.5" />
                <span>Payment selection is kept with this checkout form.</span>
              </div>
              {statusMessage ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {statusMessage}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </form>
    </div>
  );
}

type PaymentOptionProps = {
  checked: boolean;
  description: string;
  icon: ReactNode;
  label: string;
  name: string;
  onChange: () => void;
  value: PaymentMethod;
};

function PaymentOption({
  checked,
  description,
  icon,
  label,
  name,
  onChange,
  value,
}: PaymentOptionProps) {
  return (
    <label
      className={cn(
        "grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border p-4 transition-colors",
        checked
          ? "border-red-600 bg-red-50/60"
          : "hover:border-muted-foreground/50",
      )}
    >
      <span className="grid size-10 place-items-center rounded-full border bg-background text-red-600">
        {icon}
      </span>
      <span className="grid gap-1">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-sm">{description}</span>
      </span>
      <input
        checked={checked}
        className="size-4 accent-red-600"
        name={name}
        onChange={onChange}
        type="radio"
        value={value}
      />
    </label>
  );
}

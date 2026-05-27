"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "./use-cart";

export function CartNavButton() {
  const { itemCount } = useCart();

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="relative size-9 rounded-full"
    >
      <Link href="/cart" aria-label="Cart" title="Cart">
        <ShoppingCart className="size-4" />
        {itemCount > 0 ? (
          <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-4 text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}

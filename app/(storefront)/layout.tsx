import Link from "next/link";
import { Heart } from "lucide-react";

import { CartNavButton } from "@/components/storefront/cart-nav-button";
import { StorefrontMobileMenu } from "@/components/storefront/storefront-mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto grid h-14 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:h-16 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
          <Link
            href="/"
            className="min-w-0 shrink font-semibold tracking-tight"
            aria-label="The Bookstore home"
          >
            <span className="text-base font-semibold sm:text-lg">The</span>
            <span className="text-xs font-semibold sm:text-sm">
              Bookstore
            </span>
          </Link>

          <div className="hidden items-center justify-center gap-6 text-sm font-medium md:flex">
            <Link className="text-foreground" href="/">
              Books
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/#new"
            >
              New arrivals
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/#catalog"
            >
              Catalog
            </Link>
          </div>

          <div className="flex justify-end gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
            >
              <Link href="/saved" aria-label="Saved books" title="Saved books">
                <Heart className="size-4" />
              </Link>
            </Button>
            <CartNavButton />
            <StorefrontMobileMenu />
          </div>
        </div>
      </nav>
      {children}
    </main>
  );
}

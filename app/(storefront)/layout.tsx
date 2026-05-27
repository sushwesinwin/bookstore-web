import Link from "next/link";

import { StorefrontMobileMenu } from "@/components/storefront/storefront-mobile-menu";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
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

          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
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

          <StorefrontMobileMenu />
        </div>
      </nav>
      {children}
    </main>
  );
}

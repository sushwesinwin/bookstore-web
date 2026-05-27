import Link from "next/link";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-lg font-semibold">The</span>
            <span className="text-sm font-semibold">Bookstore</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
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
        </div>
      </nav>
      {children}
    </main>
  );
}

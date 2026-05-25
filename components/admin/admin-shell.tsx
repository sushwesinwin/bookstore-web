import type { ReactNode } from "react";
import Link from "next/link";
import { BookMarked, LayoutDashboard, Tags } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminNavKey = "dashboard" | "books" | "categories";

const adminNavItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    key: "books",
    label: "Books",
    href: "/admin/books",
    icon: BookMarked,
  },
  {
    key: "categories",
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
] satisfies Array<{
  key: AdminNavKey;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}>;

type AdminShellProps = {
  active: AdminNavKey;
  children: ReactNode;
};

export function AdminShell({ active, children }: AdminShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-muted/30 lg:flex">
      <aside className="border-b bg-background lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col gap-6 px-4 py-5">
          <div className="px-2">
            <p className="text-sm font-semibold">Bookstore Admin</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Manage store operations
            </p>
          </div>

          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {adminNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex h-10 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                    item.key === active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}

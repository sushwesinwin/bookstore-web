import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationButton({
  className,
  isActive,
  ...props
}: React.ComponentProps<typeof Button> & {
  isActive?: boolean;
}) {
  return (
    <Button
      data-slot="pagination-button"
      variant={isActive ? "default" : "ghost"}
      size="icon"
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size: "icon",
        }),
        "size-8",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Go to previous page"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeft className="size-4" />
    </PaginationButton>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Go to next page"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronRight className="size-4" />
    </PaginationButton>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
};

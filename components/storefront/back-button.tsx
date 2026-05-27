import Link from "next/link";

import { Button } from "@/components/ui/button";

type BackButtonProps = {
  href?: string;
  label?: string;
};

export function BackButton({
  href = "/",
  label = "Back to books",
}: BackButtonProps) {
  return (
    <Button asChild variant="ghost" size="icon" className="size-8 shadow-none">
      <Link href={href} aria-label={label} title={label}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="#5985E1"
          aria-hidden="true"
          className="size-4"
        >
          <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
        </svg>
      </Link>
    </Button>
  );
}

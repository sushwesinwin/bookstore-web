"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BookActionsProps = {
  bookTitle: string;
  className?: string;
};

export function BookActions({ bookTitle, className }: BookActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  function toggleSaved() {
    setIsSaved((current) => {
      const nextSaved = !current;
      setActionMessage(nextSaved ? "Saved" : "Removed from saved");
      return nextSaved;
    });
  }

  async function shareBook() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: bookTitle,
          url,
        });
        setActionMessage("Shared");
        return;
      }

      await navigator.clipboard.writeText(url);
      setActionMessage("Link copied");
    } catch {
      setActionMessage("Share unavailable");
    }
  }

  return (
    <div className={cn("grid shrink-0 justify-items-end gap-2", className)}>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={isSaved ? "Remove from saved" : "Save book"}
          aria-pressed={isSaved}
          title={isSaved ? "Remove from saved" : "Save book"}
          onClick={toggleSaved}
          className="size-9 rounded-full sm:size-10"
        >
          <Heart
            className={isSaved ? "size-4 fill-red-600 text-red-600" : "size-4"}
          />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Share book"
          title="Share book"
          onClick={shareBook}
          className="size-9 rounded-full sm:size-10"
        >
          <Share2 className="size-4" />
        </Button>
      </div>

      {actionMessage ? (
        <p className="text-right text-xs font-medium text-red-600 sm:text-sm">
          {actionMessage}
        </p>
      ) : null}
    </div>
  );
}

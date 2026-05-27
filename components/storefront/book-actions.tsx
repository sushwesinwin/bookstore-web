"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type BookActionsProps = {
  bookTitle: string;
};

export function BookActions({ bookTitle }: BookActionsProps) {
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
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={isSaved ? "Remove from saved" : "Save book"}
          aria-pressed={isSaved}
          title={isSaved ? "Remove from saved" : "Save book"}
          onClick={toggleSaved}
          className="size-10"
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
          className="size-10"
        >
          <Share2 className="size-4" />
        </Button>
      </div>

      {actionMessage ? (
        <p className="text-sm font-medium text-red-600">{actionMessage}</p>
      ) : null}
    </div>
  );
}

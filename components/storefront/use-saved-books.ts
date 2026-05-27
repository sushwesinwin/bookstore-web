"use client";

import { useCallback, useEffect, useState } from "react";

const SAVED_BOOKS_KEY = "bookstore:saved-book-ids";
const SAVED_BOOKS_EVENT = "bookstore:saved-books-change";

function readSavedBookIds() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const savedValue = window.localStorage.getItem(SAVED_BOOKS_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];

    return new Set(
      Array.isArray(parsedValue)
        ? parsedValue.filter(
            (value): value is string => typeof value === "string",
          )
        : [],
    );
  } catch {
    return new Set<string>();
  }
}

function writeSavedBookIds(savedBookIds: Set<string>) {
  window.localStorage.setItem(
    SAVED_BOOKS_KEY,
    JSON.stringify(Array.from(savedBookIds)),
  );
  window.dispatchEvent(new Event(SAVED_BOOKS_EVENT));
}

export function useSavedBooks() {
  const [savedBookIds, setSavedBookIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function syncSavedBookIds() {
      setSavedBookIds(readSavedBookIds());
      setIsLoaded(true);
    }

    syncSavedBookIds();
    window.addEventListener("storage", syncSavedBookIds);
    window.addEventListener(SAVED_BOOKS_EVENT, syncSavedBookIds);

    return () => {
      window.removeEventListener("storage", syncSavedBookIds);
      window.removeEventListener(SAVED_BOOKS_EVENT, syncSavedBookIds);
    };
  }, []);

  const isBookSaved = useCallback(
    (bookId: string) => savedBookIds.has(bookId),
    [savedBookIds],
  );

  const toggleSavedBook = useCallback((bookId: string) => {
    const nextSavedBookIds = readSavedBookIds();
    let isSaved = false;

    if (nextSavedBookIds.has(bookId)) {
      nextSavedBookIds.delete(bookId);
    } else {
      nextSavedBookIds.add(bookId);
      isSaved = true;
    }

    writeSavedBookIds(nextSavedBookIds);
    setSavedBookIds(nextSavedBookIds);

    return isSaved;
  }, []);

  return {
    isLoaded,
    isBookSaved,
    savedBookIds,
    toggleSavedBook,
  };
}

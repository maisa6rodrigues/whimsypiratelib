import { memo } from "react";
import { BookCard } from "./BookCard";
import type { Book } from "../../lib/library-types";

const gridCls =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function BookGridBase({ books, loading }: { books: Book[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className={gridCls} aria-busy="true" aria-live="polite">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="surface-card overflow-hidden">
            <div className="aspect-[3/4] animate-pulse bg-muted" />
            <div className="space-y-2 p-5">
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-paper/60 px-6 py-16 text-center">
        <p className="font-serif-display text-xl text-foreground">no results found</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          try adjusting your search or clearing some filters to see more books.
        </p>
      </div>
    );
  }

  return (
    <div className={gridCls}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export const BookGrid = memo(BookGridBase);

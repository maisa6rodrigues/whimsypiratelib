import { memo, useState } from "react";
import { BookOpen, Headphones, ImageOff } from "lucide-react";
import type { Book } from "../../lib/library-types";

const colors = ["pink", "purple", "blue", "yellow", "green"] as const;
function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i); return h; }
function colorFor(s: string) { return colors[Math.abs(hash(s)) % colors.length]; }

function BookCardBase({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasEbook = !!book.ebookLink && (book.type === "ebook" || book.type === "both");
  const hasAudio = !!book.audiobookLink && (book.type === "audiobook" || book.type === "both");

  const titleColor = colorFor(book.title + "·title");
  const tags = [...book.genres, ...book.themes];
  const description = book.description?.trim() ?? "";
  const isLongDescription = description.length > 140;

  const cardStyle = {
    ['--card-accent' as string]: `var(--highlight-${titleColor})`,
  } as React.CSSProperties;

  return (
    <article
      style={cardStyle}
      className="surface-card group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {!imgError && book.cover ? (
          <img
            src={book.cover}
            alt={`${book.title} by ${book.author}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0.32,1)] group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageOff className="h-7 w-7 opacity-60" strokeWidth={1.75} aria-hidden />
            <span className="text-[0.65rem] lowercase opacity-70">no cover</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="font-serif-display text-[1.3rem] leading-[1.2] text-foreground line-clamp-2 break-words">
            <span className={`title-mark title-mark-${titleColor}`}>{book.title}</span>
          </h3>
          <p className="text-[0.85rem] font-medium text-foreground-soft break-words">{book.author}</p>
        </div>

        {description && (
          <div className="text-[0.78rem] leading-relaxed text-foreground-soft">
            <p className={expanded ? "break-words" : "line-clamp-3 break-words"}>{description}</p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-[0.72rem] font-medium marker marker-yellow"
                aria-expanded={expanded}
              >
                {expanded ? "show less" : "read more"}
              </button>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((label, i) => (
              <span key={label + i} className="chip-card lowercase">
                {label}
              </span>
            ))}
          </div>
        )}

        {(hasEbook || hasAudio) && (
          <div className="mt-auto flex flex-wrap gap-2 pt-3 border-t border-border/60">
            {hasEbook && (
              <a
                href={book.ebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.78rem] font-medium text-foreground-soft transition-colors duration-200 hover:bg-[color:var(--card-accent)] hover:text-foreground"
                aria-label={`open ebook of ${book.title}`}
              >
                <BookOpen className="h-3.5 w-3.5 opacity-80" strokeWidth={1.75} aria-hidden />
                ebook
              </a>
            )}
            {hasAudio && (
              <a
                href={book.audiobookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.78rem] font-medium text-foreground-soft transition-colors duration-200 hover:bg-[color:var(--card-accent)] hover:text-foreground"
                aria-label={`open audiobook of ${book.title}`}
              >
                <Headphones className="h-3.5 w-3.5 opacity-80" strokeWidth={1.75} aria-hidden />
                audiobook
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export const BookCard = memo(BookCardBase);

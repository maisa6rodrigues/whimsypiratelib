import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import booksData from "../data/books.json";
import { Header } from "../components/library/Header";
import { Nav } from "../components/library/Nav";
import { Sidebar } from "../components/library/Sidebar";
import { BookGrid } from "../components/library/BookGrid";
import type { Book, SortMode, TypeFilter } from "../lib/library-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "whimsypirate library — ebooks & audiobooks" },
      { name: "description", content: "a small, curated collection of ebooks and audiobooks. search, filter, and download." },
      { property: "og:title", content: "whimsypirate library" },
      { property: "og:description", content: "a small, curated collection of ebooks and audiobooks." },
    ],
  }),
  component: Index,
});

// Normalize raw data once so the rest of the app can trust the shape.
const books: Book[] = (booksData as Partial<Book>[]).map((b, i) => ({
  id: b.id ?? String(i),
  title: b.title?.trim() || "untitled",
  author: b.author?.trim() || "unknown",
  description: b.description?.trim() ?? "",
  cover: b.cover ?? "",
  type: (b.type as Book["type"]) ?? "ebook",
  genres: Array.isArray(b.genres) ? b.genres.filter(Boolean) : [],
  themes: Array.isArray(b.themes) ? b.themes.filter(Boolean) : [],
  ebookLink: b.ebookLink ?? "",
  audiobookLink: b.audiobookLink ?? "",
  dateAdded: b.dateAdded ?? "",
}));

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

const allGenres = uniqueSorted(books.flatMap((b) => b.genres));
const allThemes = uniqueSorted(books.flatMap((b) => b.themes));

const lastUpdatedTs = books.reduce<number>((acc, b) => {
  const t = b.dateAdded ? new Date(b.dateAdded).getTime() : NaN;
  return Number.isFinite(t) && t > acc ? t : acc;
}, 0);
const lastUpdatedLabel = lastUpdatedTs
  ? new Date(lastUpdatedTs).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).toLowerCase()
  : null;

function Index() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Keep typing snappy: filter on the deferred value so input never stutters.
  const deferredQuery = useDeferredValue(query);

  const onToggleGenre = useCallback((val: string) => {
    setSelectedGenres((list) => (list.includes(val) ? list.filter((x) => x !== val) : [...list, val]));
  }, []);
  const onToggleTheme = useCallback((val: string) => {
    setSelectedThemes((list) => (list.includes(val) ? list.filter((x) => x !== val) : [...list, val]));
  }, []);
  const reset = useCallback(() => {
    setQuery("");
    setTypeFilter("all");
    setSelectedGenres([]);
    setSelectedThemes([]);
  }, []);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const result = books.filter((b) => {
      if (q && !b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) return false;
      if (typeFilter !== "all") {
        // "both" books match either ebook or audiobook filters
        if (typeFilter === "ebook" && b.type !== "ebook" && b.type !== "both") return false;
        if (typeFilter === "audiobook" && b.type !== "audiobook" && b.type !== "both") return false;
        if (typeFilter === "both" && b.type !== "both") return false;
      }
      if (selectedGenres.length && !selectedGenres.every((g) => b.genres.includes(g))) return false;
      if (selectedThemes.length && !selectedThemes.every((t) => b.themes.includes(t))) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sort === "alphabetical") return a.title.localeCompare(b.title);
      const at = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
      const bt = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
      return bt - at;
    });

    return result;
  }, [deferredQuery, sort, typeFilter, selectedGenres, selectedThemes]);

  // Close drawer on Escape + lock body scroll while it's open.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  // Auto-close drawer when crossing into desktop layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (mq.matches) setDrawerOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const sidebarProps = {
    query, onQuery: setQuery,
    sort, onSort: setSort,
    typeFilter, onTypeFilter: setTypeFilter,
    allGenres, selectedGenres, onToggleGenre,
    allThemes, selectedThemes, onToggleTheme,
    onReset: reset,
  };

  const countLabel = filtered.length === 1 ? "1 book" : `${filtered.length} books`;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="px-0 pb-16 pt-2">
          <Header />
          <Nav />

          {/* Mobile / tablet result + filter trigger */}
          <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
            <p className="min-w-0 truncate text-xs font-medium text-muted-foreground lowercase tabular-nums">
              {countLabel}
              {lastUpdatedLabel && (
                <span className="ml-2">
                  · updated <span className="rounded px-1 py-0.5 bg-highlight-yellow text-foreground">{lastUpdatedLabel}</span>
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="pill shrink-0"
              style={{ ['--pill-tint' as string]: 'var(--highlight-purple)' }}
              aria-label="open filters"
            >
              <Menu className="h-3.5 w-3.5 opacity-80" strokeWidth={1.75} /> filters
            </button>
          </div>

          <div className="flex gap-8 lg:gap-10">
            <div className="hidden lg:block">
              <div className="sticky top-6 w-44">
                <Sidebar {...sidebarProps} />
              </div>
            </div>

            <main className="min-w-0 flex-1">
              <div className="mb-5 hidden flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] font-medium tracking-[0.02em] text-muted-foreground lowercase tabular-nums lg:flex">
                <span>{countLabel}</span>
                {lastUpdatedLabel && (
                  <>
                    <span className="text-border">•</span>
                    <span>last updated <span className="rounded px-1.5 py-0.5 bg-highlight-yellow text-foreground">{lastUpdatedLabel}</span></span>
                  </>
                )}
              </div>
              <BookGrid books={filtered} />
            </main>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="filters"
        >
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-dvh w-[88%] max-w-sm flex-col overflow-y-auto bg-paper p-6 shadow-[var(--shadow-hover)] animate-in slide-in-from-left duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground lowercase tracking-[0.04em]">filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                aria-label="close filters"
              >
                <X className="h-4 w-4 opacity-80" strokeWidth={1.75} />
              </button>
            </div>
            <Sidebar {...sidebarProps} />
          </div>
        </div>
      )}
    </div>
  );
}

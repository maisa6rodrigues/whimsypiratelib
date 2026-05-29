import { Search, ArrowDownAZ, Clock, SlidersHorizontal, BookOpen, Headphones, Library, Tag, Sparkles, X } from "lucide-react";
import type { SortMode, TypeFilter } from "../../lib/library-types";

interface SidebarProps {
  query: string;
  onQuery: (v: string) => void;
  sort: SortMode;
  onSort: (s: SortMode) => void;
  typeFilter: TypeFilter;
  onTypeFilter: (t: TypeFilter) => void;
  allGenres: string[];
  selectedGenres: string[];
  onToggleGenre: (g: string) => void;
  allThemes: string[];
  selectedThemes: string[];
  onToggleTheme: (t: string) => void;
  onReset: () => void;
}

const palette = ["pink", "purple", "blue", "yellow", "green"] as const;
type Tint = typeof palette[number];

function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i); return h; }
function chipStyle(seed: string): React.CSSProperties {
  const c = palette[Math.abs(hash(seed)) % palette.length];
  return { ['--chip-a' as string]: `var(--highlight-${c})` };
}

const ICON_PROPS = { className: "h-3.5 w-3.5 opacity-80", strokeWidth: 1.75 } as const;

function SectionBlock({
  title, icon: Icon, tint, children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tint: Tint;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <h3 className="flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.04em] text-foreground lowercase">
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-md"
          style={{ background: `color-mix(in oklab, var(--highlight-${tint}) 70%, var(--paper))` }}
        >
          <Icon className="h-3 w-3" strokeWidth={2} />
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

const typeOptions: { value: TypeFilter; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { value: "all", label: "all", icon: Library },
  { value: "ebook", label: "ebook", icon: BookOpen },
  { value: "audiobook", label: "audiobook", icon: Headphones },
  { value: "both", label: "both", icon: Sparkles },
];

export function Sidebar(props: SidebarProps) {
  const {
    query, onQuery, sort, onSort, typeFilter, onTypeFilter,
    allGenres, selectedGenres, onToggleGenre,
    allThemes, selectedThemes, onToggleTheme, onReset,
  } = props;

  const hasActive = Boolean(query || typeFilter !== "all" || selectedGenres.length || selectedThemes.length);

  return (
    <aside className="space-y-7">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70 text-muted-foreground" strokeWidth={1.75} />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="search titles or authors"
          aria-label="search titles or authors"
          className="w-full rounded-xl border border-border bg-paper py-2.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground transition-colors duration-200"
        />
      </div>

      <SectionBlock title="sort" icon={SlidersHorizontal} tint="purple">
        <div className="flex flex-col gap-1" style={{ ['--row-tint' as string]: 'var(--highlight-purple)' }}>
          <button
            type="button"
            onClick={() => onSort("alphabetical")}
            aria-pressed={sort === "alphabetical"}
            className={`row-item ${sort === "alphabetical" ? "is-active" : ""}`}
          >
            <ArrowDownAZ {...ICON_PROPS} /> alphabetical
          </button>
          <button
            type="button"
            onClick={() => onSort("newest")}
            aria-pressed={sort === "newest"}
            className={`row-item ${sort === "newest" ? "is-active" : ""}`}
          >
            <Clock {...ICON_PROPS} /> newest
          </button>
        </div>
      </SectionBlock>

      <SectionBlock title="type" icon={Library} tint="blue">
        <div className="flex flex-wrap gap-1.5">
          {typeOptions.map(({ value, label, icon: Icon }) => {
            const active = typeFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onTypeFilter(value)}
                aria-pressed={active}
                style={chipStyle(value)}
                className={`chip ${active ? "is-active" : ""}`}
              >
                <Icon className="h-3 w-3 opacity-80" strokeWidth={1.75} aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
      </SectionBlock>

      {allGenres.length > 0 && (
        <SectionBlock title="genres" icon={BookOpen} tint="pink">
          <div className="flex flex-wrap gap-1.5">
            {allGenres.map((g) => {
              const active = selectedGenres.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => onToggleGenre(g)}
                  aria-pressed={active}
                  style={chipStyle(g)}
                  className={`chip lowercase ${active ? "is-active" : ""}`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </SectionBlock>
      )}

      {allThemes.length > 0 && (
        <SectionBlock title="themes" icon={Tag} tint="green">
          <div className="flex flex-wrap gap-1.5">
            {allThemes.map((t) => {
              const active = selectedThemes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onToggleTheme(t)}
                  aria-pressed={active}
                  style={chipStyle(t + "·")}
                  className={`chip lowercase ${active ? "is-active" : ""}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </SectionBlock>
      )}

      {hasActive && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground marker marker-pink"
        >
          <X className="h-3 w-3" strokeWidth={1.75} aria-hidden /> reset filters
        </button>
      )}
    </aside>
  );
}

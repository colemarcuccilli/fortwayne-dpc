"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Entry {
  id: string;
  text: string;
}

interface BlogContentsProps {
  entries: Entry[];
  /** id of the element that holds the post body, used to measure reading progress. */
  targetId: string;
}

/** Distance from the top of the screen where a heading counts as "current". It clears the sticky header. */
const READ_LINE = 150;

function clamp(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Table of contents for a post, built from its `##` headings.
 *
 *  - Large screens: a small panel fixed in the bottom right corner, with a
 *    reading progress bar and the current section marked.
 *  - Small screens: a bar fixed to the bottom showing the current section and
 *    an arrow. The arrow opens the full contents; tapping a section jumps to
 *    it and closes the contents. The site has no call bar today, so the bar
 *    sits at the very bottom. Anything fixed there later must sit below it.
 *
 * Both hide once the end of the post is on screen so the footer is never covered.
 */
export function BlogContents({ entries, targetId }: BlogContentsProps) {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [open, setOpen] = useState(false);
  const listId = useId();

  const update = useCallback(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const vh = window.innerHeight;

    // 0 when the body reaches the read line, 1 when its end is 70% down the screen.
    const travel = rect.height - (vh * 0.7 - READ_LINE);
    const done = READ_LINE - rect.top;
    setProgress(travel > 0 ? clamp(done / travel) : done > 0 ? 1 : 0);

    let current = -1;
    for (let i = 0; i < entries.length; i++) {
      const el = document.getElementById(entries[i].id);
      if (el && el.getBoundingClientRect().top <= READ_LINE + 10) current = i;
    }
    setActive(current);

    // The last of the post is about to slide under the bottom bar.
    setFinished(rect.bottom <= vh + 64);
  }, [entries, targetId]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      update();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [update]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch {
      /* the jump still worked */
    }
    setOpen(false);
  };

  if (entries.length === 0) return null;

  const percent = Math.round(progress * 100);
  const currentTitle = active >= 0 ? entries[active].text : "Introduction";

  return (
    <>
      {/* ---------------- Large screens: corner panel ---------------- */}
      <aside
        aria-label="Contents of this article"
        className={cn(
          "fixed bottom-6 right-6 z-30 hidden w-60 transition-opacity duration-200 lg:block",
          finished && "pointer-events-none opacity-0",
        )}
      >
        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto rounded-2xl border border-border/70 bg-surface/95 p-4 shadow-lg backdrop-blur">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
              On this page
            </p>
            <p className="font-mono text-xs tabular-nums text-muted-foreground">
              {percent}%
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="mt-2.5 h-1 overflow-hidden rounded-full bg-border"
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-150"
              style={{ width: `${percent}%` }}
            />
          </div>
          <ol className="mt-3 space-y-0.5">
            {entries.map((entry, i) => (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  onClick={(e) => jump(e, entry.id)}
                  aria-current={i === active ? "location" : undefined}
                  className={cn(
                    "flex gap-2.5 rounded-lg px-2 py-1.5 text-[13px] leading-snug transition-colors",
                    i === active
                      ? "bg-brand-muted/70 font-semibold text-brand-dark"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-px w-4 shrink-0 font-mono text-[11px] tabular-nums",
                      i === active ? "text-brand" : "text-muted-foreground/70",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span>{entry.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {/* ---------------- Small screens: bottom bar ---------------- */}
      {open && (
        <button
          type="button"
          aria-label="Close contents"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/25 lg:hidden"
        />
      )}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(10,37,64,0.08)] backdrop-blur transition-transform duration-200 lg:hidden",
          finished && !open && "translate-y-full",
        )}
      >
        {open && (
          <nav
            id={listId}
            aria-label="Contents of this article"
            className="absolute inset-x-0 bottom-full max-h-[min(60vh,26rem)] overflow-y-auto rounded-t-2xl border-x border-t border-border/70 bg-background shadow-[0_-10px_30px_rgba(10,37,64,0.12)]"
          >
            <p className="px-5 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
              In this article
            </p>
            <ol className="px-2 pb-3">
              {entries.map((entry, i) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    onClick={(e) => jump(e, entry.id)}
                    aria-current={i === active ? "location" : undefined}
                    className={cn(
                      "flex gap-3 rounded-lg px-3 py-3 text-[15px] leading-snug transition-colors",
                      i === active
                        ? "bg-brand-muted/70 font-semibold text-brand-dark"
                        : "text-foreground/80 active:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "w-5 shrink-0 font-mono text-xs tabular-nums leading-snug",
                        i === active ? "text-brand" : "text-muted-foreground/70",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span>{entry.text}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5 bg-border"
        >
          <div
            className="h-full bg-brand transition-[width] duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label={open ? "Close contents" : "Open contents"}
          className="flex h-14 w-full items-center gap-3 px-5 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
              {active >= 0 ? `Section ${active + 1} of ${entries.length}` : "Contents"}
            </span>
            <span className="block truncate text-sm font-semibold text-foreground">
              {currentTitle}
            </span>
          </span>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground/80">
            <ChevronUp
              className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
              aria-hidden
            />
          </span>
        </button>
      </div>
    </>
  );
}

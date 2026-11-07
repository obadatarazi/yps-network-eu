import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, FileText, LayoutList, MapPin, Clapperboard } from "lucide-react";
import type { Activity, Copy, HubId, Lang } from "@/lib/copy";
import {
  activityHubIds,
  activityYear,
  documentedActivities,
} from "@/lib/copy";
import { trackEvent } from "@/lib/umami";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { DownloadButton } from "@/components/motion/download-button";
import { SplitWords } from "@/components/motion/split-words";

type ViewMode = "cinematic" | "compact";

type Props = {
  c: Copy;
  lang: Lang;
  announce: (message: string) => void;
};

const VIEW_KEY = "eyps-journey-view";

function dateParts(dateISO: string, lang: Lang) {
  const date = new Date(`${dateISO}T12:00:00`);
  const locale = lang === "ar" ? "ar" : "en-GB";
  return {
    day: date.toLocaleDateString(locale, { day: "2-digit" }),
    month: date.toLocaleDateString(locale, { month: "short" }),
    year: date.toLocaleDateString(locale, { year: "numeric" }),
  };
}

function Chunk({
  index,
  children,
  className = "",
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`activity-chunk ${className}`} style={{ "--i": index } as CSSProperties}>
      {children}
    </div>
  );
}

function hubTitle(c: Copy, id: HubId) {
  return c.hubs.find((hub) => hub.id === id)?.title ?? id;
}

function Tags({
  event,
  c,
}: {
  event: Activity;
  c: Copy;
}) {
  return (
    <ul className="activity-tags">
      <li className="activity-tag is-format">{c.formatLabel[event.format]}</li>
      {event.themes.map((theme) => (
        <li key={theme} className="activity-tag">
          {c.themeLabel[theme]}
        </li>
      ))}
    </ul>
  );
}

function ChapterMedia({ event }: { event: Activity }) {
  if (!event.video && !event.quote) return null;
  return (
    <div className="activity-chapter-media">
      {event.video ? (
        <div className="activity-chapter-video">
          <video controls playsInline preload="metadata" title={event.video.title}>
            <source src={event.video.src} />
          </video>
          <p className="activity-chapter-video-label">
            <Clapperboard aria-hidden="true" className="size-3.5" />
            {event.video.title}
          </p>
        </div>
      ) : null}
      {event.quote ? (
        <blockquote className="activity-chapter-quote">
          <p>{event.quote.text}</p>
          {event.quote.attribution ? <cite>{event.quote.attribution}</cite> : null}
        </blockquote>
      ) : null}
    </div>
  );
}

function Docs({
  event,
  c,
  announce,
  className = "activity-chapter-docs",
}: {
  event: Activity;
  c: Copy;
  announce: (message: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {event.documents.map((doc) => (
        <DownloadButton
          key={doc.href}
          href={doc.href}
          label={doc.label}
          busyLabel={c.downloading}
          doneLabel={c.downloaded}
          srTitle={`${event.title} — ${doc.label}`}
          onDownload={() =>
            trackEvent("timeline-file-download", {
              event: event.id,
              file: doc.href,
            })
          }
          onDone={() => announce(`${c.downloaded}: ${doc.label}`)}
        />
      ))}
    </div>
  );
}

function HubPin({
  hub,
  c,
  lang,
}: {
  hub: HubId;
  c: Copy;
  lang: Lang;
}) {
  return (
    <Link
      to={lang === "ar" ? "/ar/regions" : "/regions"}
      search={{ hub }}
      className="activity-hub-pin"
    >
      <MapPin aria-hidden="true" className="size-3.5" />
      {c.timelineHubPin}: {hubTitle(c, hub)}
    </Link>
  );
}

export function ActivityTimeline({ c, lang, announce }: Props) {
  const allItems = useMemo(() => documentedActivities(c), [c]);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const navLockRef = useRef<{ index: number; until: number } | null>(null);
  const [active, setActive] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [view, setView] = useState<ViewMode>("cinematic");
  const [regionFilter, setRegionFilter] = useState<"all" | HubId>("all");
  const [yearFilter, setYearFilter] = useState<"all" | string>("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      if (saved === "compact" || saved === "cinematic") {
        setView(saved);
        return;
      }
    } catch {
      /* private mode */
    }
    if (window.matchMedia("(max-width: 639px)").matches) setView("compact");
  }, []);

  const years = useMemo(
    () => Array.from(new Set(allItems.map((item) => activityYear(item.dateISO)))).sort(),
    [allItems],
  );

  const regions = useMemo(() => {
    const ids = new Set<HubId>();
    for (const item of allItems) {
      for (const hub of activityHubIds(item)) ids.add(hub);
    }
    return c.hubs.filter((hub) => ids.has(hub.id));
  }, [allItems, c.hubs]);

  const items = useMemo(() => {
    return allItems.filter((item) => {
      if (yearFilter !== "all" && activityYear(item.dateISO) !== yearFilter) return false;
      if (regionFilter !== "all" && !activityHubIds(item).includes(regionFilter)) return false;
      return true;
    });
  }, [allItems, regionFilter, yearFilter]);

  const total = items.length;
  const activeSafe = Math.min(active, Math.max(0, total - 1));
  const activeItem = items[activeSafe];

  useEffect(() => {
    setActive(0);
  }, [regionFilter, yearFilter, view]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const index = items.findIndex((item) => item.id === hash);
    if (index < 0) return;
    setActive(index);
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  }, [items, reduced]);

  useEffect(() => {
    if (view !== "cinematic") return;
    const root = rootRef.current;
    if (!root) return;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!chapters.length) return;

    let frame = 0;
    let lastBest = -1;
    let lastProgress = -1;

    function measure() {
      frame = 0;
      const lock = navLockRef.current;
      if (lock && performance.now() < lock.until) {
        if (lastBest !== lock.index) {
          lastBest = lock.index;
          setActive(lock.index);
        }
        return;
      }
      if (lock) navLockRef.current = null;

      const viewMid = window.innerHeight * 0.38;
      let best = 0;
      let bestDist = Infinity;
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index]!;
        const rect = chapter.getBoundingClientRect();
        const mid = rect.top + rect.height * 0.35;
        const dist = Math.abs(mid - viewMid);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      }

      if (best !== lastBest) {
        lastBest = best;
        setActive(best);
      }

      const current = chapters[best];
      if (!current) return;
      const rect = current.getBoundingClientRect();
      const local = Math.min(1, Math.max(0, (viewMid - rect.top) / Math.max(1, rect.height)));
      if (Math.abs(local - lastProgress) >= 0.03) {
        lastProgress = local;
        setChapterProgress(local);
      }
    }

    function requestMeasure() {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
    };
  }, [items, view]);

  useEffect(() => {
    const id = activeItem?.id;
    if (!id || typeof window === "undefined") return;
    const next = `#${id}`;
    if (window.location.hash === next) return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
  }, [activeItem?.id]);

  function scrollToChapter(index: number) {
    const clamped = Math.min(items.length - 1, Math.max(0, index));
    const id = items[clamped]?.id;
    if (!id) return;

    // Keep scroll-spy from snapping active back while we animate to the target.
    navLockRef.current = { index: clamped, until: performance.now() + 900 };
    setActive(clamped);

    const node = document.getElementById(id);
    if (!node) return;

    const chrome = rootRef.current?.querySelector<HTMLElement>(".activity-journey-chrome");
    const offset = (chrome?.getBoundingClientRect().height ?? 96) + 24;
    const top = node.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduced ? "auto" : "smooth",
    });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
      if (!inView) return;

      const rtl = lang === "ar";
      let delta = 0;
      if (event.key === "ArrowDown" || event.key === "PageDown") delta = 1;
      else if (event.key === "ArrowUp" || event.key === "PageUp") delta = -1;
      else if (event.key === "ArrowRight") delta = rtl ? -1 : 1;
      else if (event.key === "ArrowLeft") delta = rtl ? 1 : -1;
      else return;
      if (!items.length) return;
      event.preventDefault();
      scrollToChapter(activeSafe + delta);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSafe, items, lang, reduced, view]);

  const journeyProgress =
    total <= 1 ? 1 : Math.min(1, (activeSafe + (reduced ? 1 : chapterProgress * 0.85)) / total);

  function setViewMode(mode: ViewMode) {
    setView(mode);
    try {
      localStorage.setItem(VIEW_KEY, mode);
    } catch {
      /* ignore */
    }
  }

  function renderYearBreak(year: string, key: string) {
    return (
      <div key={key} className="activity-year-break" aria-hidden="true">
        <span>{year}</span>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`activity-journey is-${view}`}>
      <div className="activity-journey-chrome">
        <div className="activity-journey-chrome-top">
          <p className="activity-journey-now" aria-live="polite">
            <span className="activity-journey-now-label">{c.showing}</span>
            <span className="activity-journey-now-title">{activeItem?.title ?? "—"}</span>
          </p>
          <div className="activity-journey-toolbar">
            <div className="activity-view-toggle" role="group" aria-label={c.timelineViewMode}>
              <button
                type="button"
                className={view === "cinematic" ? "is-active" : ""}
                aria-pressed={view === "cinematic"}
                onClick={() => setViewMode("cinematic")}
              >
                <Clapperboard aria-hidden="true" className="size-3.5" />
                {c.timelineCinematic}
              </button>
              <button
                type="button"
                className={view === "compact" ? "is-active" : ""}
                aria-pressed={view === "compact"}
                onClick={() => setViewMode("compact")}
              >
                <LayoutList aria-hidden="true" className="size-3.5" />
                {c.timelineCompact}
              </button>
            </div>
            <p className="activity-journey-count" dir="ltr">
              <span className="tabular-nums">{String(total ? activeSafe + 1 : 0).padStart(2, "0")}</span>
              <span className="activity-journey-count-sep">/</span>
              <span className="tabular-nums">{String(total).padStart(2, "0")}</span>
            </p>
          </div>
        </div>

        <details className="activity-journey-filters">
          <summary className="activity-filters-summary">
            {c.timelineFilters}
            {regionFilter !== "all" || yearFilter !== "all" ? (
              <span className="activity-filters-active-dot" aria-hidden="true" />
            ) : null}
          </summary>
          <div className="activity-filter-group" role="group" aria-label={c.timelineFilterYear}>
            <span className="activity-filter-label">{c.timelineFilterYear}</span>
            <div className="activity-filter-rail">
              <button
                type="button"
                className={`activity-filter-chip${yearFilter === "all" ? " is-active" : ""}`}
                onClick={() => setYearFilter("all")}
              >
                {c.timelineFilterAll}
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`activity-filter-chip${yearFilter === year ? " is-active" : ""}`}
                  onClick={() => setYearFilter(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="activity-filter-group" role="group" aria-label={c.timelineFilterRegion}>
            <span className="activity-filter-label">{c.timelineFilterRegion}</span>
            <div className="activity-filter-rail">
              <button
                type="button"
                className={`activity-filter-chip${regionFilter === "all" ? " is-active" : ""}`}
                onClick={() => setRegionFilter("all")}
              >
                {c.timelineFilterAll}
              </button>
              {regions.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  className={`activity-filter-chip${regionFilter === hub.id ? " is-active" : ""}`}
                  onClick={() => setRegionFilter(hub.id)}
                >
                  {hub.title}
                </button>
              ))}
            </div>
          </div>
        </details>

        {view === "cinematic" ? (
          <>
            <div className="activity-journey-progress-track" aria-hidden="true">
              <div
                className="activity-journey-progress-fill"
                style={{ transform: `scaleX(${reduced || !total ? 1 : journeyProgress})` }}
              />
            </div>
            <ol className="activity-journey-dots">
              {items.map((event, index) => {
                const parts = dateParts(event.dateISO, lang);
                return (
                  <li key={event.id}>
                    <button
                      type="button"
                      className={`activity-journey-dot${index === activeSafe ? " is-active" : ""}${index < activeSafe ? " is-past" : ""}`}
                      aria-current={index === activeSafe ? "true" : undefined}
                      aria-label={`${parts.day} ${parts.month}: ${event.title}`}
                      onClick={() => scrollToChapter(index)}
                    >
                      <span className="activity-journey-dot-mark" aria-hidden="true" />
                      <span className="activity-journey-dot-label" dir="ltr">
                        {parts.day} {parts.month}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </>
        ) : null}

        <div className="activity-journey-nav">
          <button
            type="button"
            className="activity-nav-btn"
            disabled={activeSafe <= 0 || !total}
            onClick={() => scrollToChapter(activeSafe - 1)}
          >
            <ChevronLeft aria-hidden="true" className="size-4 rtl-flip" />
            {c.timelinePrev}
          </button>
          <button
            type="button"
            className="activity-nav-btn"
            disabled={activeSafe >= total - 1 || !total}
            onClick={() => scrollToChapter(activeSafe + 1)}
          >
            {c.timelineNext}
            <ChevronRight aria-hidden="true" className="size-4 rtl-flip" />
          </button>
        </div>
      </div>

      {!total ? (
        <p className="activity-empty">{c.timelineEmptyFilter}</p>
      ) : view === "compact" ? (
        <ol className="activity-compact-list">
          {items.map((event, index) => {
            const year = activityYear(event.dateISO);
            const prevYear = index > 0 ? activityYear(items[index - 1]!.dateISO) : null;
            const parts = dateParts(event.dateISO, lang);
            const hub = event.hubId;
            return (
              <li key={event.id}>
                {year !== prevYear ? renderYearBreak(year, `y-${year}`) : null}
                <article
                  id={event.id}
                  data-chapter
                  className={`activity-compact-card${index === activeSafe ? " is-active" : ""}`}
                >
                  <button type="button" className="activity-compact-hit" onClick={() => setActive(index)}>
                    <span className="activity-compact-date" dir="ltr">
                      {parts.day} {parts.month} {parts.year}
                    </span>
                    <h3 className="activity-compact-title">{event.title}</h3>
                  </button>
                  <Tags event={event} c={c} />
                  <p className="activity-chapter-where">{event.where}</p>
                  <p className="activity-chapter-summary">{event.summary}</p>
                  <ChapterMedia event={event} />
                  {hub ? <HubPin hub={hub} c={c} lang={lang} /> : null}
                  <Docs event={event} c={c} announce={announce} />
                </article>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="activity-journey-chapters">
          {items.map((event, index) => {
            const parts = dateParts(event.dateISO, lang);
            const step = String(index + 1).padStart(2, "0");
            const isActive = index === activeSafe || reduced;
            const docCount = event.documents.length;
            const year = activityYear(event.dateISO);
            const prevYear = index > 0 ? activityYear(items[index - 1]!.dateISO) : null;
            const hub = event.hubId;

            return (
              <div key={event.id}>
                {year !== prevYear ? renderYearBreak(year, `cine-y-${year}`) : null}
                <section
                  id={event.id}
                  data-chapter
                  className={`activity-chapter${isActive ? " is-active" : ""}`}
                  aria-labelledby={`activity-title-${event.id}`}
                >
                  <div className="activity-chapter-sticky">
                    <aside className="activity-chapter-date" aria-hidden="true">
                      <span className="activity-chapter-day tabular-nums" dir="ltr">
                        {parts.day}
                      </span>
                      <span className="activity-chapter-monthyear" dir="ltr">
                        {parts.month}
                        <span className="activity-chapter-year">{parts.year}</span>
                      </span>
                      <span className="activity-chapter-node" />
                    </aside>

                    <article className="activity-chapter-panel">
                      <Chunk index={0} className="activity-chapter-kicker-wrap">
                        <p className="activity-chapter-kicker">
                          <span className="activity-chapter-step tabular-nums" dir="ltr">
                            {step}
                            <span className="activity-chapter-step-total">
                              {" "}
                              / {String(total).padStart(2, "0")}
                            </span>
                          </span>
                          <span className="activity-chapter-when" dir="ltr">
                            {event.when}
                          </span>
                        </p>
                        <p className="activity-chapter-docs-count">
                          <FileText aria-hidden="true" className="size-3.5 shrink-0" />
                          <span>
                            {docCount}{" "}
                            {docCount === 1 ? c.timelineDocument : c.timelineDocuments}
                          </span>
                        </p>
                      </Chunk>

                      <Chunk index={1}>
                        <Tags event={event} c={c} />
                      </Chunk>

                      <Chunk index={2}>
                        {reduced || !isActive ? (
                          <h3 id={`activity-title-${event.id}`} className="activity-chapter-title">
                            {event.title}
                          </h3>
                        ) : (
                          <SplitWords
                            as="h3"
                            id={`activity-title-${event.id}`}
                            text={event.title}
                            className="activity-chapter-title is-revealed"
                          />
                        )}
                      </Chunk>

                      <Chunk index={3}>
                        <p className="activity-chapter-where">{event.where}</p>
                      </Chunk>

                      <Chunk index={4}>
                        <p className="activity-chapter-summary">{event.summary}</p>
                      </Chunk>

                      <Chunk index={5}>
                        <ChapterMedia event={event} />
                      </Chunk>

                      {hub ? (
                        <Chunk index={6}>
                          <HubPin hub={hub} c={c} lang={lang} />
                        </Chunk>
                      ) : null}

                      <Chunk index={7}>
                        <Docs event={event} c={c} announce={announce} />
                      </Chunk>
                    </article>
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      )}

      <p className="activity-timeline-closing">{c.timelineClosing}</p>
    </div>
  );
}

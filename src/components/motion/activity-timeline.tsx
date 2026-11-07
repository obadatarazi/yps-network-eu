import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { FileText } from "lucide-react";
import type { Copy, Lang } from "@/lib/copy";
import { documentedActivities } from "@/lib/copy";
import { trackEvent } from "@/lib/umami";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { DownloadButton } from "@/components/motion/download-button";
import { SplitWords } from "@/components/motion/split-words";

type Props = {
  c: Copy;
  lang: Lang;
  announce: (message: string) => void;
};

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

export function ActivityTimeline({ c, lang, announce }: Props) {
  const items = useMemo(() => documentedActivities(c), [c]);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!chapters.length) return;

    function update() {
      const viewMid = window.innerHeight * 0.38;
      let best = 0;
      let bestDist = Infinity;
      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const mid = rect.top + rect.height * 0.35;
        const dist = Math.abs(mid - viewMid);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      setActive(best);

      const current = chapters[best];
      if (!current) return;
      const rect = current.getBoundingClientRect();
      const local = (viewMid - rect.top) / Math.max(1, rect.height);
      setChapterProgress(Math.min(1, Math.max(0, local)));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  const total = items.length;
  const activeItem = items[active] ?? items[0];
  const journeyProgress =
    total <= 1 ? 1 : Math.min(1, (active + (reduced ? 1 : chapterProgress * 0.85)) / total);

  function scrollToChapter(index: number) {
    const node = rootRef.current?.querySelectorAll<HTMLElement>("[data-chapter]")[index];
    node?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <div ref={rootRef} className="activity-journey">
      <div className="activity-journey-chrome">
        <div className="activity-journey-chrome-top">
          <p className="activity-journey-now" aria-live="polite">
            <span className="activity-journey-now-label">{c.showing}</span>
            <span className="activity-journey-now-title">{activeItem?.title}</span>
          </p>
          <p className="activity-journey-count" dir="ltr">
            <span className="tabular-nums">{String(active + 1).padStart(2, "0")}</span>
            <span className="activity-journey-count-sep">/</span>
            <span className="tabular-nums">{String(total).padStart(2, "0")}</span>
          </p>
        </div>

        <div className="activity-journey-progress-track" aria-hidden="true">
          <div
            className="activity-journey-progress-fill"
            style={{ transform: `scaleX(${reduced ? 1 : journeyProgress})` }}
          />
        </div>

        <ol className="activity-journey-dots">
          {items.map((event, index) => {
            const parts = dateParts(event.dateISO, lang);
            return (
              <li key={event.id}>
                <button
                  type="button"
                  className={`activity-journey-dot${index === active ? " is-active" : ""}${index < active ? " is-past" : ""}`}
                  aria-current={index === active ? "true" : undefined}
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
      </div>

      <div className="activity-journey-chapters">
        {items.map((event, index) => {
          const parts = dateParts(event.dateISO, lang);
          const step = String(index + 1).padStart(2, "0");
          const isActive = index === active || reduced;
          const docCount = event.documents.length;

          return (
            <section
              key={event.id}
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
                      <span dir="ltr">
                        {docCount}
                        {lang === "ar"
                          ? docCount === 1
                            ? " مستند"
                            : " مستندات"
                          : docCount === 1
                            ? " document"
                            : " documents"}
                      </span>
                    </p>
                  </Chunk>

                  <Chunk index={1}>
                    {reduced ? (
                      <h3 id={`activity-title-${event.id}`} className="activity-chapter-title">
                        {event.title}
                      </h3>
                    ) : (
                      <SplitWords
                        as="h3"
                        id={`activity-title-${event.id}`}
                        text={event.title}
                        className={`activity-chapter-title${isActive ? " is-revealed" : ""}`}
                      />
                    )}
                  </Chunk>

                  <Chunk index={2}>
                    <p className="activity-chapter-where">{event.where}</p>
                  </Chunk>

                  <Chunk index={3}>
                    <p className="activity-chapter-summary">{event.summary}</p>
                  </Chunk>

                  <Chunk index={4} className="activity-chapter-docs">
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
                  </Chunk>
                </article>
              </div>
            </section>
          );
        })}
      </div>

      <p className="activity-timeline-closing">{c.timelineClosing}</p>
    </div>
  );
}

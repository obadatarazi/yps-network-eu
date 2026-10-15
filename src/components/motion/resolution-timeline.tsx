import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { Reveal } from "@/components/motion/reveal";

type Item = { code: string; year: string; text: string };

export function ResolutionTimeline({ items }: { items: Item[] }) {
  const reduced = usePrefersReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list || reduced) return;

    const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-milestone]"));

    function update() {
      const node = listRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewMid = window.innerHeight * 0.45;
      const start = rect.top;
      const end = rect.bottom;
      const raw = (viewMid - start) / Math.max(1, end - start);
      setProgress(Math.min(1, Math.max(0, raw)));

      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, index) => {
        const mid = card.getBoundingClientRect().top + card.offsetHeight / 2;
        const dist = Math.abs(mid - viewMid);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      setActive(best);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items, reduced]);

  return (
    <div className="resolution-timeline relative ps-2">
      <div className="timeline-track" aria-hidden="true">
        <div className="timeline-fill" style={{ transform: `scaleY(${reduced ? 1 : progress})` }} />
      </div>
      <ol ref={listRef} className="grid gap-3">
        {items.map((item, index) => (
          <Reveal key={item.code} as="li" delay={index * 90}>
            <div
              data-milestone
              className={`milestone-card rounded-lg border border-line bg-paper p-4 ${
                active === index || reduced ? "is-active" : ""
              }`}
            >
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0 font-display text-2xl font-semibold tabular-nums">
                <span dir="ltr">{item.code}</span>
                <span className="text-base font-medium text-muted" dir="ltr">
                  {item.year}
                </span>
              </p>
              <p className="mt-2">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

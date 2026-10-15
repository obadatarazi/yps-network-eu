import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const DEFAULT_ITEMS = [
  "Europe",
  "MENA",
  "Sub-Saharan Africa",
  "Eastern Mediterranean",
  "Gulf",
  "Sahel",
  "Youth · Peace · Security",
];

export function RegionMarquee({
  items = DEFAULT_ITEMS,
  label = "Regions across the network",
}: {
  items?: string[];
  label?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const loop = [...items, ...items];

  return (
    <div className="region-marquee no-print" aria-label={label}>
      <div className={`region-marquee-track ${reduced ? "is-static" : ""}`}>
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="region-marquee-item">
            <span className="region-marquee-dot" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

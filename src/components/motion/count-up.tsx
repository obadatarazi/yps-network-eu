import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

function parseMetric(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { target: 0, suffix: value, decimals: 0 };
  const numeric = match[1] ?? "0";
  return {
    target: Number(numeric),
    suffix: match[2] ?? "",
    decimals: numeric.includes(".") ? (numeric.split(".")[1]?.length ?? 0) : 0,
  };
}

export function CountUp({
  value,
  className,
  duration = 1400,
  accentSuffix = false,
  dir,
}: {
  value: string;
  className?: string;
  duration?: number;
  /** Render a trailing suffix, such as "+", smaller and in the mark colour. */
  accentSuffix?: boolean;
  /** Keep Western figures in LTR when the page is Arabic. */
  dir?: "ltr" | "rtl";
}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLParagraphElement>({ once: true, threshold: 0.4 });
  const { target, suffix, decimals } = parseMetric(value);
  const [display, setDisplay] = useState(reduced ? value : `0${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduced || target === 0) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * eased;
      setDisplay(`${current.toFixed(decimals)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, target, suffix, decimals, value, duration]);

  const marked =
    accentSuffix && suffix.length > 0 && display.endsWith(suffix)
      ? { figure: display.slice(0, -suffix.length), suffix }
      : null;

  return (
    <p ref={ref} className={className} aria-label={value} dir={dir}>
      <span aria-hidden="true">
        {marked ? (
          <>
            {marked.figure}
            <span className="metric-suffix">{marked.suffix}</span>
          </>
        ) : (
          display
        )}
      </span>
    </p>
  );
}

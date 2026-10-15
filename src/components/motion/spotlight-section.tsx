import {
  useRef,
  type AriaAttributes,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Soft cursor spotlight for dark inverse bands (metrics). */
export function SpotlightSection({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
} & Pick<AriaAttributes, "aria-label">) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  function onMove(event: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section
      ref={ref as never}
      className={cn("spotlight-section", className)}
      aria-label={ariaLabel}
      onPointerMove={onMove}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
        } as CSSProperties
      }
    >
      {children}
    </section>
  );
}

import type { CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Staggered word reveal — keeps the full sentence for screen readers. */
export function SplitWords({
  text,
  className,
  as: Tag = "h1",
  id,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p";
  id?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/);

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={cn("split-words", className)} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="split-word"
          aria-hidden="true"
          style={{ "--i": index } as CSSProperties}
        >
          <span className="split-word-inner">{word}</span>
          {index < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </Tag>
  );
}

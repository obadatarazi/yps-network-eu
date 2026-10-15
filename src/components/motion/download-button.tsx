import { useEffect, useRef, useState, type MouseEvent } from "react";

type DownloadState = "idle" | "busy" | "done";

type DownloadButtonProps = {
  label: string;
  busyLabel: string;
  doneLabel: string;
  /** Screen-reader suffix naming the file, e.g. the resource title. */
  srTitle: string;
  /** Real file → rendered as `<a download>`; otherwise a button calling `onDownload`. */
  href?: string;
  onDownload?: () => void;
  /** Fires when the "done" state shows (use it to announce to screen readers). */
  onDone?: () => void;
  className?: string;
};

const BUSY_MS = 950;
const RESET_MS = 3200;

/**
 * Download control with a short story: the arrow drops into the tray while a
 * fill sweeps across, then a check mark draws in. Labels share one grid cell,
 * so the button never changes width between states.
 */
export function DownloadButton({
  label,
  busyLabel,
  doneLabel,
  srTitle,
  href,
  onDownload,
  onDone,
  className = "",
}: DownloadButtonProps) {
  const [state, setState] = useState<DownloadState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function handleClick(_event: MouseEvent) {
    onDownload?.();
    if (state !== "idle") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setState("busy");
    timers.current.push(
      setTimeout(
        () => {
          setState("done");
          onDone?.();
        },
        reduce ? 0 : BUSY_MS,
      ),
      setTimeout(() => setState("idle"), RESET_MS),
    );
  }

  const content = (
    <>
      <span className="dl-fill" aria-hidden="true" />
      <span className="dl-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <g className="dl-arrow">
            <path d="M12 3.5v11" />
            <path d="m7 10 5 5 5-5" />
          </g>
          <path className="dl-tray" d="M4.5 15.5v2.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.5" />
          <path className="dl-check" d="m6.5 12.5 3.8 3.8 7.2-8" pathLength={1} />
        </svg>
      </span>
      <span className="dl-labels">
        <span data-label="idle" aria-hidden={state !== "idle"}>
          {label}
        </span>
        <span data-label="busy" aria-hidden={state !== "busy"}>
          {busyLabel}
        </span>
        <span data-label="done" aria-hidden={state !== "done"}>
          {doneLabel}
        </span>
      </span>
      <span className="sr-only">: {srTitle}</span>
    </>
  );

  const classes = `btn btn-secondary dl-btn w-full sm:w-auto ${className}`;

  if (href) {
    return (
      <a className={classes} data-state={state} href={href} download onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} data-state={state} onClick={handleClick}>
      {content}
    </button>
  );
}

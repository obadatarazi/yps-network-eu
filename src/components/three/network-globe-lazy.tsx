import { lazy, Suspense, useEffect, useState, type ComponentProps } from "react";

const Globe = lazy(() =>
  import("@/components/three/network-globe").then((mod) => ({
    default: mod.NetworkGlobe,
  })),
);

type Props = ComponentProps<typeof Globe>;

function GlobeFallback({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--color-accent) 35%, transparent), transparent 55%), radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--color-action) 40%, transparent), transparent 60%), var(--color-inverse)",
      }}
    />
  );
}

/**
 * Client-only mount so Three.js never enters the SSR graph. Waits for the page
 * load and an idle moment so the globe never competes with first paint.
 */
export function NetworkGlobeLazy(props: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      } else {
        timeoutId = globalThis.setTimeout(() => setReady(true), 600);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready || props.disabled) {
    return <GlobeFallback className={props.className} />;
  }

  return (
    <Suspense fallback={<GlobeFallback className={props.className} />}>
      <Globe {...props} />
    </Suspense>
  );
}

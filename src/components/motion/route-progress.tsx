import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

type Phase = "idle" | "loading" | "done";

/**
 * Slim top bar for page navigation: creeps forward while a page chunk loads,
 * then sweeps to the end and fades once the new page is on screen.
 */
export function RouteProgress() {
  const loading = useRouterState({ select: (state) => state.status === "pending" });
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [phase, setPhase] = useState<Phase>("idle");
  const firstPath = useRef(pathname);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setPhase("loading"), 80);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    if (pathname === firstPath.current) return;
    firstPath.current = pathname;
    setPhase("done");
    const timer = window.setTimeout(() => setPhase("idle"), 520);
    return () => window.clearTimeout(timer);
  }, [loading, pathname]);

  return <div className="route-progress no-print" data-phase={phase} aria-hidden="true" />;
}

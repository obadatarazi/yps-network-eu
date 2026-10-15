/** Umami Cloud website ID (public — embedded in the tracker script). */
export const UMAMI_WEBSITE_ID = "6fddd00a-19f1-43ee-b992-d8dfa5b9be4c";
export const UMAMI_SCRIPT_SRC = "https://cloud.umami.is/script.js";

type UmamiTrack = {
  (event: string, data?: Record<string, string | number | boolean>): void;
  (payload?: Record<string, unknown>): void;
  (callback: (props: Record<string, unknown>) => Record<string, unknown>): void;
};

declare global {
  interface Window {
    umami?: {
      track: UmamiTrack;
      identify: (data: Record<string, string | number | boolean>) => void;
    };
  }
}

/** Fire a named custom event when the Umami tracker is loaded. */
export function trackEvent(
  name: string,
  data?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined" || !window.umami?.track) return;
  if (data) {
    window.umami.track(name, data);
    return;
  }
  window.umami.track(name);
}

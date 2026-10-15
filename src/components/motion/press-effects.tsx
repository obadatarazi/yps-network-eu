import { useEffect } from "react";

const PRESSABLE =
  ".btn, .icon-btn, .lang-link, .mobile-nav-link, .a11y-fab-btn, .chip-rail-item";

/**
 * One delegated listener gives every button/link-button a tactile ink ripple
 * from the exact press point. Skipped entirely for reduced-motion users.
 */
export function PressEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function onPointerDown(event: PointerEvent) {
      if (reduce.matches || event.button > 0) return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(PRESSABLE);
      if (!target || target.matches(":disabled")) return;

      const rect = target.getBoundingClientRect();
      const size = Math.hypot(rect.width, rect.height) * 2;
      const ripple = document.createElement("span");
      ripple.className = "press-ripple";
      ripple.setAttribute("aria-hidden", "true");
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      target.classList.add("has-ripple");
      target.append(ripple);

      const cleanup = () => ripple.remove();
      ripple.addEventListener("animationend", cleanup, { once: true });
      window.setTimeout(cleanup, 900);
    }

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}

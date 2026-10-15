import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { langFromPath } from "@/lib/i18n";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultPreload: "intent",
    // Animated page changes via the View Transitions API. The type picks the
    // CSS animation in styles.css: "page" (slide/fade) or "lang" (wipe).
    defaultViewTransition: {
      types: ({ fromLocation, toLocation, pathChanged }) => {
        if (!fromLocation || !pathChanged) return false;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
        return langFromPath(fromLocation.pathname) !== langFromPath(toLocation.pathname)
          ? ["lang"]
          : ["page"];
      },
    },
  });
}

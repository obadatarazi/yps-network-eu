import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PressEffects } from "@/components/motion/press-effects";
import { RouteProgress } from "@/components/motion/route-progress";
import { langFromPath } from "@/lib/i18n";
import {
  APP_NAME,
  GEO,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SITE_DOMAIN,
  SITE_URL,
  jsonLdScripts,
} from "@/lib/seo";
import { UMAMI_SCRIPT_SRC, UMAMI_WEBSITE_ID } from "@/lib/umami";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: `${APP_NAME} | European Youth Peace and Security Network` },
      { name: "description", content: SEO_DESCRIPTION },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "author", content: APP_NAME },
      { name: "creator", content: APP_NAME },
      { name: "publisher", content: APP_NAME },
      { name: "application-name", content: APP_NAME },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      // Link previews (WhatsApp, LinkedIn, X…); per-page title/description/url in pageHead
      { property: "og:site_name", content: APP_NAME },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${APP_NAME} logo` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og.jpg` },
      { name: "twitter:image:alt", content: `${APP_NAME} logo` },
      { name: "theme-color", content: "#003366" },
      { name: "color-scheme", content: "light" },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "bingbot", content: "index, follow" },
      { name: "format-detection", content: "telephone=no" },
      { name: "rating", content: "general" },
      { name: "revisit-after", content: "7 days" },
      { name: "category", content: "nonprofit, youth, peace, security, international" },
      { name: "subject", content: "Youth, Peace and Security" },
      { name: "coverage", content: "Worldwide" },
      { name: "distribution", content: "global" },
      // Geographic SEO (GEO)
      { name: "geo.region", content: GEO.region },
      { name: "geo.placename", content: GEO.placename },
      { name: "geo.position", content: GEO.position },
      { name: "ICBM", content: GEO.icbm },
      // Discovery for assistants / GEO
      { name: "ai-content", content: "public, citeable" },
      { name: "llms-txt", content: `${SITE_URL}/llms.txt` },
    ],
    links: [
      // canonical + hreflang alternates are per page (see pageHead in @/lib/i18n)
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "author", type: "text/plain", href: "/humans.txt" },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "LLMs.txt" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://cloud.umami.is" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Source+Sans+3:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      ...jsonLdScripts(),
      {
        src: UMAMI_SCRIPT_SRC,
        defer: true,
        "data-website-id": UMAMI_WEBSITE_ID,
        // Only send analytics from the live domain (SPA route changes + live visitors auto-tracked).
        "data-domains": `${SITE_DOMAIN},www.${SITE_DOMAIN}`,
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  // Language comes from the URL ("/ar/…" is Arabic), so the server already
  // renders the right lang/dir — no LTR→RTL flash on Arabic pages.
  const lang = useRouterState({ select: (state) => langFromPath(state.location.pathname) });

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <RouteProgress />
        <PressEffects />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

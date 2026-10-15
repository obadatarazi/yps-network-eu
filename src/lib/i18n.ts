import { SITE_URL, type Lang } from "@/lib/copy";
import { APP_NAME } from "@/lib/seo";

/**
 * URL-based language: English lives at the root (`/team`), Arabic under `/ar`
 * (`/ar/team`). The URL is the single source of truth for the page language.
 */

export type SitePageId =
  | "home"
  | "pillars"
  | "regions"
  | "team"
  | "activities"
  | "resources"
  | "join";

export const PAGE_PATH: Record<SitePageId, string> = {
  home: "/",
  pillars: "/pillars",
  regions: "/regions",
  team: "/team",
  activities: "/activities",
  resources: "/resources",
  join: "/join",
};

export const AR_PREFIX = "/ar";

export function langFromPath(pathname: string): Lang {
  return pathname === AR_PREFIX || pathname.startsWith(`${AR_PREFIX}/`) ? "ar" : "en";
}

/** "/ar/team" → "/team", "/ar" → "/", "/team/" → "/team". */
export function stripLang(pathname: string): string {
  let path = pathname;
  if (path === AR_PREFIX || path === `${AR_PREFIX}/`) return "/";
  if (path.startsWith(`${AR_PREFIX}/`)) path = path.slice(AR_PREFIX.length);
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

/** The same page in another language: ("/team", "ar") → "/ar/team". */
export function localizePath(path: string, lang: Lang): string {
  const base = stripLang(path);
  if (lang === "en") return base;
  return base === "/" ? AR_PREFIX : `${AR_PREFIX}${base}`;
}

function absolute(path: string) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

const PAGE_META: Record<SitePageId, Record<Lang, { title: string; description: string }>> = {
  home: {
    en: {
      title: `${APP_NAME} | European Youth Peace and Security Network`,
      description:
        "European Youth Peace and Security Network (EYPS Network) — young activists, advocates, researchers, and changemakers advancing the United Nations Youth, Peace and Security Agenda in more than 82 countries.",
    },
    ar: {
      title: `${APP_NAME} | الشبكة الأوروبية للشباب والسلام والأمن`,
      description:
        "الشبكة الأوروبية للشباب والسلام والأمن — ناشطون ومناصرون وباحثون شباب يعملون على تعزيز أجندة الأمم المتحدة للشباب والسلام والأمن في أكثر من 82 دولة.",
    },
  },
  pillars: {
    en: {
      title: `Five pillars | ${APP_NAME}`,
      description:
        "Participation, protection, prevention, partnerships, and disengagement and reintegration — the five YPS pillars of the EU YPS Network.",
    },
    ar: {
      title: `الركائز الخمس | ${APP_NAME}`,
      description:
        "المشاركة والحماية والوقاية والشراكات وفك الارتباط وإعادة الإدماج — الركائز الخمس لأجندة الشباب والسلام والأمن.",
    },
  },
  regions: {
    en: {
      title: `Regions | ${APP_NAME}`,
      description:
        "Regional structure of the European Youth Peace and Security Network across Africa, Europe, Latin America and the Caribbean, Asia and the Middle East.",
    },
    ar: {
      title: `الأقاليم | ${APP_NAME}`,
      description:
        "الهيكل الإقليمي للشبكة الأوروبية للشباب والسلام والأمن في أفريقيا وأوروبا وأمريكا اللاتينية والكاريبي وآسيا والشرق الأوسط.",
    },
  },
  team: {
    en: {
      title: `Meet the Team | ${APP_NAME}`,
      description:
        "Regional Administrators and coordinators of the European Youth Peace and Security Network (EYPS Network).",
    },
    ar: {
      title: `تعرّف على الفريق | ${APP_NAME}`,
      description: "المنسقون والمسؤولون الإقليميون في الشبكة الأوروبية للشباب والسلام والأمن.",
    },
  },
  activities: {
    en: {
      title: `Activities | ${APP_NAME}`,
      description:
        "Dialogue, inclusion, and capacity-building — how the EU YPS Network strengthens youth participation in peace and security.",
    },
    ar: {
      title: `الأنشطة | ${APP_NAME}`,
      description:
        "الحوار والإدماج وبناء القدرات — كيف تعزز الشبكة مشاركة الشباب في قضايا السلام والأمن.",
    },
  },
  resources: {
    en: {
      title: `Resources | ${APP_NAME}`,
      description:
        "Downloadable policy briefs, toolkits, and training notes from the European Youth Peace and Security Network.",
    },
    ar: {
      title: `الموارد | ${APP_NAME}`,
      description:
        "موجزات سياسات وأدلة عملية ومواد تدريبية قابلة للتنزيل من الشبكة الأوروبية للشباب والسلام والأمن.",
    },
  },
  join: {
    en: {
      title: `Join | ${APP_NAME}`,
      description:
        "Contact the European Youth Peace and Security Network. Prepare a message from your browser — nothing is uploaded to a server.",
    },
    ar: {
      title: `انضم | ${APP_NAME}`,
      description:
        "تواصل مع الشبكة الأوروبية للشباب والسلام والأمن. جهّز رسالتك من متصفحك — لا يُرفع أي شيء إلى خادم.",
    },
  },
};

/** Route `head()` for a page: localized title/description + canonical and hreflang alternates. */
export function pageHead(page: SitePageId, lang: Lang) {
  const meta = PAGE_META[page][lang];
  const path = PAGE_PATH[page];
  return {
    meta: [
      { title: meta.title },
      { name: "description", content: meta.description },
      { property: "og:title", content: meta.title },
      { property: "og:description", content: meta.description },
      { property: "og:url", content: absolute(localizePath(path, lang)) },
      { property: "og:locale", content: lang === "ar" ? "ar_AR" : "en_US" },
      { property: "og:locale:alternate", content: lang === "ar" ? "en_US" : "ar_AR" },
      { name: "twitter:title", content: meta.title },
      { name: "twitter:description", content: meta.description },
    ],
    links: [
      { rel: "canonical", href: absolute(localizePath(path, lang)) },
      { rel: "alternate", hrefLang: "en", href: absolute(path) },
      { rel: "alternate", hrefLang: "ar", href: absolute(localizePath(path, "ar")) },
      { rel: "alternate", hrefLang: "x-default", href: absolute(path) },
    ],
  };
}

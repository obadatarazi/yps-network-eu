import { NETWORK_EMAIL, SITE_DOMAIN, SITE_URL, SOCIAL_LINKS } from "@/lib/copy";

export const APP_NAME = "EU YPS Network";
export const APP_NAME_FULL = "European Youth Peace and Security Network (EYPS Network)";

export const SEO_DESCRIPTION =
  "European Youth Peace and Security Network (EYPS Network) — young activists, advocates, researchers, and changemakers advancing the United Nations Youth, Peace and Security Agenda in more than 82 countries.";

export const SEO_KEYWORDS = [
  "EU YPS Network",
  "EYPS Network",
  "European Youth Peace and Security Network",
  "Youth Peace and Security",
  "UNSCR 2250",
  "YPS Agenda",
  "youth peacebuilding",
  "United Nations YPS",
  "UN Youth Peace and Security",
  "Regional Administrators",
].join(", ");

/** Geographic SEO — network contact location (Brussels). */
export const GEO = {
  placename: "Brussels",
  region: "BE",
  position: "50.8503;4.3517",
  icbm: "50.8503, 4.3517",
  latitude: 50.8503,
  longitude: 4.3517,
} as const;

export const SITE_SECTIONS = [
  { id: "pillars", path: "/pillars", en: "Five pillars", ar: "الركائز الخمس" },
  { id: "hubs", path: "/regions", en: "Regions", ar: "الأقاليم" },
  { id: "team", path: "/team", en: "Meet the Team", ar: "تعرّف على الفريق" },
  { id: "focus", path: "/activities", en: "Activities", ar: "الأنشطة" },
  { id: "resources", path: "/resources", en: "Resources", ar: "الموارد" },
  { id: "join", path: "/join", en: "Join", ar: "انضم" },
] as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["NGO", "Organization"],
    name: APP_NAME_FULL,
    alternateName: [APP_NAME, "EYPS Network", "EU Youth, Peace and Security Network"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og.jpg`,
    email: NETWORK_EMAIL,
    description: SEO_DESCRIPTION,
    foundingDate: "2025",
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressLocality: GEO.placename,
      addressCountry: GEO.region,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    sameAs: SOCIAL_LINKS.map((link) => link.href),
    knowsAbout: [
      "Youth, Peace and Security",
      "UN Security Council Resolution 2250",
      "United Nations YPS Agenda",
      "Peacebuilding",
      "Youth participation",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: NETWORK_EMAIL,
      contactType: "inquiries",
      availableLanguage: ["English", "Arabic"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    alternateName: APP_NAME_FULL,
    url: SITE_URL,
    description: SEO_DESCRIPTION,
    inLanguage: ["en", "ar"],
    publisher: {
      "@type": "Organization",
      name: APP_NAME_FULL,
      url: SITE_URL,
    },
  };
}

export function webPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: APP_NAME,
    url: SITE_URL,
    description: SEO_DESCRIPTION,
    isPartOf: { "@type": "WebSite", url: SITE_URL },
    about: {
      "@type": "Thing",
      name: "Youth, Peace and Security Agenda",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og.jpg`,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#hero-title", "#about-title"],
    },
  };
}

export function breadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      ...SITE_SECTIONS.map((section, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: section.en,
        item: `${SITE_URL}${section.path}`,
      })),
    ],
  };
}

export function jsonLdScripts() {
  return [organizationJsonLd(), websiteJsonLd(), webPageJsonLd(), breadcrumbJsonLd()].map((data) => ({
    type: "application/ld+json" as const,
    children: JSON.stringify(data),
  }));
}

export { SITE_DOMAIN, SITE_URL };

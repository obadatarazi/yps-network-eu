import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Accessibility,
  ArrowUp,
  CircleAlert,
  Contrast,
  Handshake,
  Languages,
  HeartHandshake,
  Instagram,
  Laptop,
  Leaf,
  Linkedin,
  Mail,
  Menu,
  Printer,
  Shield,
  Sprout,
  Users,
  X,
} from "lucide-react";
import {
  NETWORK_EMAIL,
  SITE_DOMAIN,
  SITE_URL,
  SOCIAL_LINKS,
  copy,
  fill,
  type Copy,
  type Lang,
  type PillarId,
  type ResourceKind,
  type SocialId,
} from "@/lib/copy";
import type { TeamMemberCopy } from "@/lib/team";
import {
  FIELD_LIMITS,
  isHoneypotTripped,
  isJoinRateLimited,
  recordJoinPrepare,
  sanitizeText,
  wasFilledTooFast,
} from "@/lib/form-security";
import { JOIN_CHANNEL_IDS, joinChannelLabel } from "@/lib/join-channels";
import { MessageSentMark } from "@/components/message-sent-mark";
import { trackEvent } from "@/lib/umami";
import { BridgeField } from "@/components/motion/bridge-field";
import { CountUp } from "@/components/motion/count-up";
import { DownloadButton } from "@/components/motion/download-button";
import { Magnetic } from "@/components/motion/magnetic";
import { RegionMarquee } from "@/components/motion/region-marquee";
import { Reveal } from "@/components/motion/reveal";
import { ResolutionTimeline } from "@/components/motion/resolution-timeline";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SplitWords } from "@/components/motion/split-words";
import { SpotlightSection } from "@/components/motion/spotlight-section";
import { TiltCard } from "@/components/motion/tilt-card";
import { NetworkGlobeLazy as NetworkGlobe } from "@/components/three/network-globe-lazy";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { langFromPath, localizePath, stripLang, type SitePageId } from "@/lib/i18n";

const socialIcons: Record<SocialId, typeof Linkedin> = {
  linkedin: Linkedin,
  instagram: Instagram,
};

export type { SitePageId };

type Scale = 0 | 1 | 2;
type FormErrors = ("name" | "email" | "region" | "message" | "consent" | "captcha" | "rate" | "send" | "unconfigured")[];

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY ?? "";

type HCaptchaApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
    },
  ) => string;
};

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
  }
}

const pillarIcons: Record<PillarId, typeof Users> = {
  participation: Users,
  protection: Shield,
  prevention: Sprout,
  partnerships: Handshake,
  reintegration: HeartHandshake,
};

const focusIcons = [Leaf, Accessibility, Laptop] as const;

export function SitePage({ page }: { page: SitePageId }) {
  const [scale, setScale] = useState<Scale>(1);
  const [contrast, setContrast] = useState(false);
  const [plain, setPlain] = useState(false);
  const [live, setLive] = useState("");
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // The URL decides the language: "/ar/…" is Arabic, everything else English.
  const lang = langFromPath(pathname);
  const c = copy[lang];

  useEffect(() => {
    const storedScale = localStorage.getItem("yps-scale");
    const storedContrast = localStorage.getItem("yps-contrast");
    const storedPlain = localStorage.getItem("yps-plain");
    if (storedScale === "0" || storedScale === "1" || storedScale === "2") {
      setScale(Number(storedScale) as Scale);
    }
    if (storedContrast === "1") setContrast(true);
    if (storedPlain === "1") setPlain(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.scale = String(scale);
    document.documentElement.dataset.contrast = contrast ? "high" : "normal";
  }, [lang, scale, contrast]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  function announce(message: string) {
    setLive("");
    window.setTimeout(() => setLive(message), 40);
  }

  function changeScale(direction: -1 | 1) {
    setScale((current) => {
      const next = Math.min(2, Math.max(0, current + direction)) as Scale;
      if (next === current) {
        announce(c.announced.limit);
        return current;
      }
      localStorage.setItem("yps-scale", String(next));
      announce(direction < 0 ? c.announced.smaller : c.announced.larger);
      return next;
    });
  }

  function toggleContrast() {
    setContrast((current) => {
      const next = !current;
      localStorage.setItem("yps-contrast", next ? "1" : "0");
      announce(next ? c.announced.contrastOn : c.announced.contrastOff);
      return next;
    });
  }

  function togglePlain() {
    setPlain((current) => {
      const next = !current;
      localStorage.setItem("yps-plain", next ? "1" : "0");
      announce(next ? c.announced.plainOn : c.announced.plainOff);
      return next;
    });
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        {c.skip}
      </a>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {live}
      </p>
      <ScrollProgress />
      <Header c={c} lang={lang} announce={announce} pathname={pathname} />
      <AccessibilityFab
        c={c}
        scale={scale}
        contrast={contrast}
        plain={plain}
        announce={announce}
        onScale={changeScale}
        onContrast={toggleContrast}
        onPlain={togglePlain}
      />
      <BackToTop label={c.backToTop} />
      <main id="main-content">
        {page === "home" && (
          <>
            <Hero c={c} lang={lang} plain={plain} />
            <RegionMarquee
              items={
                lang === "ar"
                  ? ["أوروبا", "الشرق الأوسط وشمال أفريقيا", "أفريقيا جنوب الصحراء", "الخليج", "الساحل", "شباب · سلام · أمن"]
                  : undefined
              }
            />
            <Metrics c={c} />
            <About c={c} plain={plain} />
          </>
        )}
        {page === "pillars" && <Pillars c={c} plain={plain} />}
        {page === "regions" && <Hubs c={c} plain={plain} lang={lang} />}
        {page === "team" && <Team c={c} />}
        {page === "activities" && <Focus c={c} plain={plain} announce={announce} />}
        {page === "resources" && <Resources c={c} lang={lang} announce={announce} />}
        {page === "join" && <Join c={c} lang={lang} announce={announce} />}
      </main>
      <Footer c={c} lang={lang} pathname={pathname} />
    </>
  );
}

/** Centre the language-switch wipe (styles.css `vt-lang-in`) on the pressed control. */
function markTransitionOrigin(event: { clientX: number; clientY: number; currentTarget: Element }) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;
  document.documentElement.style.setProperty("--vt-x", `${Math.round(x)}px`);
  document.documentElement.style.setProperty("--vt-y", `${Math.round(y)}px`);
}

function getScrollY() {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(getScrollY() > 320);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.visualViewport?.addEventListener("scroll", onScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
      window.visualViewport?.removeEventListener("scroll", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
    };
  }, []);

  function goTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Force document top — sticky #top anchors are unreliable on mobile browsers.
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const main = document.getElementById("main-content");
    if (main instanceof HTMLElement) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }

  return (
    <button
      type="button"
      className="back-to-top no-print"
      hidden={!visible}
      aria-label={label}
      onClick={goTop}
    >
      <ArrowUp aria-hidden="true" className="size-5 shrink-0" />
      <span className="back-to-top-label">{label}</span>
    </button>
  );
}

function AccessibilityFab({
  c,
  scale,
  contrast,
  plain,
  announce,
  onScale,
  onContrast,
  onPlain,
}: {
  c: Copy;
  scale: Scale;
  contrast: boolean;
  plain: boolean;
  announce: (message: string) => void;
  onScale: (direction: -1 | 1) => void;
  onContrast: () => void;
  onPlain: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        announce(c.announced.a11yClose);
        buttonRef.current?.focus();
      }
    }

    function onPointer(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
        announce(c.announced.a11yClose);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open, announce, c.announced.a11yClose]);

  function toggle() {
    setOpen((current) => {
      const next = !current;
      announce(next ? c.announced.a11yOpen : c.announced.a11yClose);
      return next;
    });
  }

  return (
    <div ref={rootRef} className="a11y-fab no-print">
      <div
        id={panelId}
        className={`a11y-fab-panel ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-hidden={!open}
        aria-label={c.accessibility}
        inert={!open || undefined}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
          <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-ink">
            {c.accessibility}
          </p>
          <button
            type="button"
            className="icon-btn size-10 min-h-10 min-w-10 shrink-0 p-0"
            aria-label={c.closeAccessibility}
            onClick={() => {
              setOpen(false);
              announce(c.announced.a11yClose);
              buttonRef.current?.focus();
            }}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 pt-3">
          <div role="group" aria-labelledby="text-size-label" className="flex flex-wrap items-center gap-2">
            <span id="text-size-label" className="w-full text-sm font-semibold text-ink">
              {c.textSize}
            </span>
            <button
              type="button"
              className="icon-btn px-3 text-base"
              aria-label={c.smaller}
              disabled={scale === 0}
              onClick={() => onScale(-1)}
            >
              <span aria-hidden="true">A−</span>
            </button>
            <button
              type="button"
              className="icon-btn px-3 text-lg"
              aria-label={c.larger}
              disabled={scale === 2}
              onClick={() => onScale(1)}
            >
              <span aria-hidden="true">A+</span>
            </button>
          </div>

          <button
            type="button"
            className="icon-btn w-full justify-start"
            aria-pressed={contrast}
            aria-label={contrast ? c.contrastOn : c.contrast}
            onClick={onContrast}
          >
            <Contrast aria-hidden="true" className="size-4 shrink-0" />
            <span aria-hidden="true">{contrast ? c.contrastOn : c.contrast}</span>
          </button>

          <button
            type="button"
            className="icon-btn w-full justify-start"
            aria-pressed={plain}
            aria-label={plain ? c.plainOn : c.plain}
            onClick={onPlain}
          >
            <span aria-hidden="true">{plain ? c.plainOn : c.plain}</span>
          </button>
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        className="a11y-fab-btn"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? c.closeAccessibility : c.openAccessibility}
        onClick={toggle}
      >
        <UniversalAccessIcon />
      </button>
    </div>
  );
}

function UniversalAccessIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-full"
      aria-hidden="true"
      focusable="false"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM9.25 3.75C9.25 4.44036 8.69036 5 8 5C7.30964 5 6.75 4.44036 6.75 3.75C6.75 3.05964 7.30964 2.5 8 2.5C8.69036 2.5 9.25 3.05964 9.25 3.75ZM12 8H9.41901L11.2047 13H9.081L8 9.97321L6.91901 13H4.79528L6.581 8H4V6H12V8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Header({
  c,
  lang,
  announce,
  pathname,
}: {
  c: Copy;
  lang: Lang;
  announce: (message: string) => void;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const current = stripLang(pathname);
  const otherLang: Lang = lang === "en" ? "ar" : "en";
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        announce(c.announced.menuClose);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, announce, c.announced.menuClose]);

  function toggleMenu() {
    setOpen((value) => {
      const next = !value;
      announce(next ? c.announced.menuOpen : c.announced.menuClose);
      if (!next) menuButton.current?.focus();
      return next;
    });
  }

  function closeMenu() {
    setOpen(false);
    announce(c.announced.menuClose);
  }

  return (
    <header
      id="top"
      className="site-header sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md"
    >
      <div className="site-header-bar mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          to={localizePath("/", lang)}
          className="flex min-h-12 min-w-0 flex-1 items-center gap-2.5 text-ink no-underline sm:gap-3 lg:flex-none"
          onClick={closeMenu}
        >
          <img
            src="/logo.webp"
            alt=""
            width={48}
            height={48}
            className="logo-mark size-10 shrink-0 rounded-full sm:size-12"
          />
          <span className="min-w-0 leading-none">
            <span className="block font-display text-xl font-semibold tracking-tight">
              EU YPS
            </span>
            <span className="site-header-tagline mt-1 hidden text-sm leading-snug text-muted sm:block">
              {c.tagline}
            </span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label={c.primaryNav}>
            {c.nav
              .filter((item) => item.href !== "/join")
              .map((item) => (
                <Link
                  key={item.href}
                  to={localizePath(item.href, lang)}
                  aria-current={current === item.href ? "page" : undefined}
                  className="inline-flex min-h-11 items-center px-2.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline aria-[current=page]:underline xl:px-3 xl:text-base"
                >
                  {item.label}
                </Link>
              ))}
          </nav>
          <Link
            to={localizePath(pathname, otherLang)}
            className="lang-link no-print"
            hrefLang={otherLang}
            lang={otherLang}
            aria-label={c.switchLangLabel}
            data-umami-event="language-switch"
            data-umami-event-language={otherLang}
            onClick={(event) => {
              markTransitionOrigin(event);
              announce(copy[otherLang].announced.lang);
            }}
          >
            <Languages aria-hidden="true" className="size-4 shrink-0" />
            <span>{c.switchLangShort}</span>
          </Link>
          <Link
            to={localizePath("/join", lang)}
            className="btn btn-primary btn-header hidden whitespace-nowrap lg:inline-flex"
            data-umami-event="join-cta"
            data-umami-event-placement="header"
          >
            {c.joinCta}
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="icon-btn size-12 min-h-12 min-w-12 shrink-0 p-0 no-print lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={toggleMenu}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            <span className="sr-only">{open ? c.closeMenu : c.openMenu}</span>
          </button>
        </div>
      </div>
      {open && (
        <button
          type="button"
          className="mobile-nav-backdrop no-print lg:hidden"
          aria-label={c.closeMenu}
          onClick={closeMenu}
        />
      )}
      <div
        id="mobile-nav"
        hidden={!open}
        className="mobile-nav-panel no-print lg:hidden"
      >
        <nav
          aria-label={c.mobileNav}
          className="mobile-nav-scroll flex flex-1 flex-col gap-1 px-4 py-4 sm:px-6"
        >
          {c.nav
            .filter((item) => item.href !== "/join")
            .map((item, index) => (
              <Link
                key={item.href}
                ref={index === 0 ? firstLink : undefined}
                to={localizePath(item.href, lang)}
                className="mobile-nav-link inline-flex min-h-14 items-center rounded-lg px-3 text-lg font-semibold text-ink no-underline aria-[current=page]:bg-surface"
                style={{ "--item-index": index } as CSSProperties}
                aria-current={current === item.href ? "page" : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="mobile-nav-footer border-t border-line px-4 py-4 sm:px-6">
          <Link
            to={localizePath("/join", lang)}
            className="btn btn-primary w-full"
            onClick={closeMenu}
            data-umami-event="join-cta"
            data-umami-event-placement="mobile-nav"
          >
            {c.joinCta}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero({ c, lang, plain }: { c: Copy; lang: Lang; plain: boolean }) {
  const reduced = usePrefersReducedMotion();
  const showGlobe = !plain && !reduced;

  return (
    <section
      className="hero-stage relative overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="hero-aurora" aria-hidden="true" />
      {!plain && (
        <BridgeField className="hero-bridge pointer-events-none absolute inset-0 z-0 opacity-70" />
      )}
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:py-16">
        <div className="hero-copy min-w-0">
          <p className="hero-enter hero-enter-1 mb-3 text-xs font-semibold tracking-[0.08em] text-accent uppercase sm:mb-4 sm:text-sm">
            {c.kicker}
          </p>
          <SplitWords
            id="hero-title"
            text={c.title}
            className="display text-ink"
          />
          <p className="hero-enter hero-enter-3 mt-4 max-w-prose text-base leading-relaxed text-ink sm:mt-5 sm:text-lg">
            {plain ? c.plainSub : c.sub}
          </p>
          <div className="hero-enter hero-enter-4 mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
            <Magnetic className="w-full sm:w-auto">
              <Link
                className="btn btn-primary btn-shine w-full sm:w-auto"
                to={localizePath("/join", lang)}
                data-umami-event="join-cta"
                data-umami-event-placement="hero"
              >
                {c.joinCta}
              </Link>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto" strength={0.22}>
              <Link
                className="btn btn-secondary w-full sm:w-auto"
                to={localizePath("/pillars", lang)}
                data-umami-event="explore-pillars"
                data-umami-event-placement="hero"
              >
                {c.exploreCta}
              </Link>
            </Magnetic>
          </div>
        </div>
        <figure className="hero-enter hero-enter-5 hero-visual -mx-4 overflow-hidden border-y border-line bg-inverse sm:mx-0 sm:rounded-xl sm:border sm:shadow-lg">
          <div className="relative aspect-[16/11] w-full bg-inverse sm:aspect-[16/10]">
            {showGlobe ? (
              <>
                <NetworkGlobe className="absolute inset-0 h-full w-full" />
                <div className="hero-globe-ring" aria-hidden="true" />
                <img
                  src="/images/hero.webp"
                  alt=""
                  width={1792}
                  height={1008}
                  decoding="async"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-luminosity"
                />
              </>
            ) : (
              <img
                src="/images/hero.webp"
                alt={c.photoAlt}
                width={1792}
                height={1008}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <figcaption className="border-t border-line/40 bg-surface px-4 py-3 sm:px-5">
            <span className="block font-semibold text-ink">{c.photoCaption}</span>
            <span className="text-sm text-muted">{c.photoDetail}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Metrics({ c }: { c: Copy }) {
  return (
    <SpotlightSection
      aria-label={c.metrics.map((item) => item.label).join(", ")}
      className="bg-inverse text-inverse-fg"
    >
      <ul className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:gap-6 sm:px-6 sm:py-10 lg:grid-cols-4">
        {c.metrics.map((item, index) => (
          <Reveal key={item.label} as="li" delay={index * 120} className="metric-card">
            <div className="metric-ring" style={{ "--i": index } as CSSProperties}>
              <CountUp value={item.value} className="stat-num text-inverse-fg" />
            </div>
            <p className="mt-2 text-sm font-medium leading-snug sm:mt-3 sm:text-base">{item.label}</p>
          </Reveal>
        ))}
      </ul>
    </SpotlightSection>
  );
}

function About({ c, plain }: { c: Copy; plain: boolean }) {
  return (
    <section id="about" className="border-b border-line bg-surface" aria-labelledby="about-title">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-12 lg:py-16">
        <Reveal className="min-w-0 lg:col-span-7">
          <h2 id="about-title" className="section-title">
            {c.aboutTitle}
          </h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed sm:text-lg">
            {plain ? c.aboutPlain : c.about}
          </p>
          <p className="mt-6 text-sm font-semibold text-muted">{c.partnersLabel}</p>
          <p className="mt-1 max-w-prose">{c.partners}</p>
        </Reveal>
        <div className="min-w-0 lg:col-span-5">
          <ResolutionTimeline items={c.resolutions} />
        </div>
      </div>
    </section>
  );
}

function Pillars({ c, plain }: { c: Copy; plain: boolean }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pillar = c.pillars[active];
  const Icon = pillarIcons[pillar.id];

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = c.pillars.length - 1;
    let next = index;
    if (event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="pillars" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16" aria-labelledby="pillars-title">
      <Reveal>
        <h2 id="pillars-title" className="section-title">
          {c.pillarsTitle}
        </h2>
        <p className="mt-3 max-w-prose text-base leading-relaxed sm:text-lg">{c.pillarsIntro}</p>
        <p className="mt-2 text-sm text-muted">{c.pillarsHint}</p>
      </Reveal>
      <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-12">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={c.pillarsTitle}
          className="grid gap-2 lg:col-span-5"
        >
          {c.pillars.map((item, index) => {
            const ItemIcon = pillarIcons[item.id];
            const selected = index === active;
            return (
              <Reveal key={item.id} delay={index * 70}>
                <button
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`pillar-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls="pillar-panel"
                  tabIndex={selected ? 0 : -1}
                  className="pillar-tab flex min-h-12 w-full items-start gap-3 rounded-lg border border-line bg-surface px-3 py-3 text-start"
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => move(event, index)}
                >
                  <span className={`pillar-orb ${selected ? "is-active" : ""}`} aria-hidden="true">
                    <ItemIcon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">
                      <span className="me-2 tabular-nums text-muted">0{index + 1}</span>
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{item.lede}</span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
        <article
          role="tabpanel"
          id="pillar-panel"
          aria-labelledby={`pillar-tab-${pillar.id}`}
          tabIndex={0}
          className="pillar-panel rounded-xl border border-line bg-surface p-4 lg:col-span-7 lg:p-6"
          key={pillar.id}
        >
          <p className="text-sm font-semibold text-accent">
            {c.showing}: {pillar.title}
          </p>
          <h3 className="mt-2 flex items-center gap-2 text-2xl">
            <span className="pillar-orb is-active" aria-hidden="true">
              <Icon className="size-6" />
            </span>
            {pillar.title}
          </h3>
          {plain ? (
            <p className="mt-4 max-w-prose text-lg">{pillar.plain}</p>
          ) : (
            <>
              <p className="mt-4 max-w-prose text-lg">{pillar.body}</p>
              <ul className="mt-4 grid gap-2 ps-5">
                {pillar.points.map((point) => (
                  <li key={point} className="list-disc">
                    {point}
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </div>
    </section>
  );
}

function Hubs({ c, plain, lang }: { c: Copy; plain: boolean; lang: Lang }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const hub = c.hubs[active];

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = c.hubs.length - 1;
    const rtl = lang === "ar";
    let next: number | null = null;
    if (event.key === "ArrowRight") next = rtl ? (index === 0 ? last : index - 1) : index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = rtl ? (index === last ? 0 : index + 1) : index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="hubs" className="border-y border-line bg-surface" aria-labelledby="hubs-title">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
        <h2 id="hubs-title" className="section-title">
          {c.hubsTitle}
        </h2>
        <p className="mt-3 max-w-prose text-base leading-relaxed sm:text-lg">{c.hubsIntro}</p>
        <p className="mt-2 text-sm text-muted">{c.hubsHint}</p>
        <div role="tablist" aria-label={c.hubsTitle} className="chip-rail mt-6">
          {c.hubs.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`hub-tab-${item.id}`}
                aria-selected={selected}
                aria-controls="hub-panel"
                tabIndex={selected ? 0 : -1}
                className="icon-btn chip-rail-item shrink-0 snap-start whitespace-nowrap"
                onClick={() => setActive(index)}
                onKeyDown={(event) => move(event, index)}
              >
                {item.title}
              </button>
            );
          })}
        </div>
        <article
          role="tabpanel"
          id="hub-panel"
          aria-labelledby={`hub-tab-${hub.id}`}
          tabIndex={0}
          className="mt-4 rounded-xl border border-line bg-paper p-4 sm:p-6"
        >
          <h3 className="text-xl sm:text-2xl">{hub.title}</h3>
          <p className="mt-2 font-semibold text-muted">{hub.lede}</p>
          {plain ? (
            <p className="mt-4 max-w-prose text-base leading-relaxed sm:text-lg">{hub.plain}</p>
          ) : (
            <>
              <p className="mt-4 max-w-prose text-base leading-relaxed sm:text-lg">{hub.body}</p>
              <ul className="mt-4 grid gap-2 ps-5">
                {hub.points.map((point) => (
                  <li key={point} className="list-disc">
                    {point}
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </div>
    </section>
  );
}

function Team({ c }: { c: Copy }) {
  const [active, setActive] = useState<TeamMemberCopy | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!active) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 40);

    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setActive(null);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lastFocus.current?.focus();
    };
  }, [active]);

  return (
    <section id="team" className="border-y border-line bg-surface" aria-labelledby="team-title">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
        <h2 id="team-title" className="section-title">
          {c.teamTitle}
        </h2>
        <p className="mt-3 max-w-prose text-base leading-relaxed sm:text-lg">{c.teamIntro}</p>
        <ul className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {c.team.map((member, index) => (
            <Reveal key={member.id} as="li" delay={(index % 4) * 80}>
              <TiltCard className="h-full">
                <article className="team-card flex h-full flex-col overflow-hidden rounded-xl border border-line bg-paper">
                  <div className="team-card-media overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.alt}
                      width={480}
                      height={480}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover object-top sm:aspect-square"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <h3 className="text-lg leading-tight sm:text-xl">{member.name}</h3>
                      <p className="mt-1 text-sm text-muted">{member.role}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary mt-auto w-full"
                      data-umami-event="team-read-more"
                      data-umami-event-member={member.id}
                      onClick={() => setActive(member)}
                    >
                      {c.teamReadMore}
                      <span className="sr-only">: {member.name}</span>
                    </button>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>

      {active && (
        <div
          className="team-dialog-scrim fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            aria-label={c.teamDialogLabel}
            className="team-dialog max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-paper p-5 shadow-lg sm:max-h-[85vh] sm:rounded-xl sm:p-6"
          >
            <div className="flex items-start gap-3">
              <img
                src={active.image}
                alt=""
                width={72}
                height={72}
                className="size-16 shrink-0 rounded-lg object-cover object-top sm:size-20"
              />
              <div className="min-w-0 flex-1">
                <h3 id={titleId} className="text-2xl">
                  {active.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-muted">{active.role}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="icon-btn size-11 min-h-11 min-w-11 shrink-0 p-0"
                aria-label={c.teamClose}
                onClick={() => setActive(null)}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div id={descId} className="mt-5 grid gap-3">
              {active.bio.split("\n\n").map((paragraph, index) => (
                <p key={`${active.id}-${index}`} className="max-w-prose">
                  {paragraph}
                </p>
              ))}
            </div>
            <button type="button" className="btn btn-secondary mt-6 w-full sm:w-auto" onClick={() => setActive(null)}>
              {c.teamClose}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Focus({
  c,
  plain,
  announce,
}: {
  c: Copy;
  plain: boolean;
  announce: (message: string) => void;
}) {
  return (
    <>
      <section
        id="upcoming"
        className="border-b border-line bg-surface"
        aria-labelledby="upcoming-title"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
          <h2 id="upcoming-title" className="section-title">
            {c.upcomingTitle}
          </h2>
          <p className="mt-3 max-w-prose text-base leading-relaxed sm:text-lg">{c.upcomingIntro}</p>
          <ul className="mt-6 grid gap-4 sm:mt-8">
            {c.upcoming.map((event, index) => (
              <Reveal key={event.id} as="li" delay={index * 80} className="rounded-xl border border-line bg-paper p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl">{event.title}</h3>
                <p className="mt-2 text-sm font-semibold text-accent">{event.when}</p>
                <p className="mt-1 text-sm text-muted">{event.where}</p>
                <p className="mt-3 max-w-prose">{event.summary}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {event.documents.map((doc) => (
                    <DownloadButton
                      key={doc.href}
                      href={doc.href}
                      label={doc.label}
                      busyLabel={c.downloading}
                      doneLabel={c.downloaded}
                      srTitle={`${event.title} — ${doc.label}`}
                      onDownload={() =>
                        trackEvent("upcoming-file-download", { event: event.id, file: doc.href })
                      }
                      onDone={() => announce(`${c.downloaded}: ${doc.label}`)}
                    />
                  ))}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section id="focus" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16" aria-labelledby="focus-title">
        <h2 id="focus-title" className="section-title">
          {c.focusTitle}
        </h2>
        <p className="mt-3 max-w-prose text-base leading-relaxed sm:text-lg">{c.focusIntro}</p>
        <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-3">
          {c.focus.map((item, index) => {
            const Icon = focusIcons[index] ?? Leaf;
            return (
              <Reveal
                key={item.title}
                as="article"
                delay={index * 100}
                className="focus-card overflow-hidden rounded-xl border border-line bg-surface"
              >
                <div className="focus-media">
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={1728}
                    height={1152}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="flex items-start gap-2 text-xl">
                    <Icon aria-hidden="true" className="mt-1 size-5 shrink-0" />
                    {item.title}
                  </h3>
                  <p className="mt-3">{plain ? item.plain : item.text}</p>
                  <p className="mt-3 text-sm text-muted">{item.caption}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Resources({
  c,
  lang,
  announce,
}: {
  c: Copy;
  lang: Lang;
  announce: (message: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | ResourceKind>("all");
  const items = c.resources.filter((item) => filter === "all" || item.kind === filter);

  function applyFilter(next: "all" | ResourceKind) {
    setFilter(next);
    const count = c.resources.filter((item) => next === "all" || item.kind === next).length;
    announce(fill(c.announced.resources, count));
    trackEvent("resource-filter", { filter: next });
  }

  function download(title: string, body: string) {
    const text = `${title}\n\n${body}\n\n${NETWORK_EMAIL}\n`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replaceAll(/[^\p{L}\p{N}]+/gu, "-").replaceAll(/^-|-$/g, "")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    trackEvent("resource-download", { title });
  }

  function printBrief(title: string, body: string) {
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      announce(c.form.popups);
      return;
    }
    trackEvent("resource-print", { title });
    popup.document.open();
    popup.document.write("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Brief</title></head><body></body></html>");
    popup.document.close();
    const doc = popup.document;
    doc.documentElement.lang = lang;
    doc.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    doc.title = title;
    const style = doc.createElement("style");
    style.textContent =
      "body{font:18px/1.5 sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem;color:#142033}h1{font-size:1.7rem;line-height:1.2}";
    doc.head.append(style);
    const brand = doc.createElement("p");
    brand.textContent = "EU YPS Network";
    const heading = doc.createElement("h1");
    heading.textContent = title;
    doc.body.append(brand, heading);
    for (const line of body.split("\n")) {
      const paragraph = doc.createElement("p");
      paragraph.textContent = line.length > 0 ? line : " ";
      doc.body.append(paragraph);
    }
    const mail = doc.createElement("p");
    mail.textContent = NETWORK_EMAIL;
    doc.body.append(mail);
    popup.focus();
    popup.print();
  }

  return (
    <section id="resources" className="border-y border-line bg-surface" aria-labelledby="resources-title">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
        <h2 id="resources-title" className="section-title">
          {c.resourcesTitle}
        </h2>
        <p className="mt-3 max-w-prose text-base leading-relaxed sm:text-lg">{c.resourcesIntro}</p>
        <div role="group" aria-label={c.filterLabel} className="chip-rail mt-6">
          {c.filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className="icon-btn chip-rail-item shrink-0 snap-start whitespace-nowrap"
              aria-pressed={filter === item.id}
              onClick={() => applyFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold text-muted">{fill(c.resultCount, items.length)}</p>
        {items.length === 0 ? (
          <p className="mt-4">{c.emptyResources}</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-xl border border-line bg-paper p-4">
                <p className="text-sm font-semibold text-accent">{c.kindLabel[item.kind]}</p>
                <h3 className="mt-1 text-lg sm:text-xl">{item.title}</h3>
                <p className="mt-2 max-w-prose">{item.summary}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {item.fileHref ? (
                    <DownloadButton
                      href={item.fileHref}
                      label={c.downloadFile}
                      busyLabel={c.downloading}
                      doneLabel={c.downloaded}
                      srTitle={item.title}
                      onDownload={() => trackEvent("resource-file-download", { title: item.title })}
                      onDone={() => announce(`${c.downloaded}: ${item.title}`)}
                    />
                  ) : (
                    <>
                      <DownloadButton
                        label={c.download}
                        busyLabel={c.downloading}
                        doneLabel={c.downloaded}
                        srTitle={item.title}
                        onDownload={() => download(item.title, item.body)}
                        onDone={() => announce(`${c.downloaded}: ${item.title}`)}
                      />
                      <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={() => printBrief(item.title, item.body)}>
                        <Printer aria-hidden="true" className="size-4" />
                        {c.printPdf}
                        <span className="sr-only">: {item.title}</span>
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function CaptchaBox({ onToken }: { onToken: (token: string) => void }) {
  const holder = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!HCAPTCHA_SITE_KEY || !holder.current) return;
    let cancelled = false;
    const element = holder.current;

    function render() {
      if (cancelled || !element || !window.hcaptcha) return;
      window.hcaptcha.render(element, {
        sitekey: HCAPTCHA_SITE_KEY,
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(""),
      });
    }

    if (window.hcaptcha) {
      render();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector<HTMLScriptElement>("script[data-hcaptcha='1']");
    const script = existing ?? document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
    script.async = true;
    script.dataset.hcaptcha = "1";
    script.addEventListener("load", render, { once: true });
    if (!existing) document.head.appendChild(script);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!HCAPTCHA_SITE_KEY) return null;
  return <div id="join-captcha" ref={holder} className="mt-4 min-h-16" />;
}

function Join({
  c,
  lang,
  announce,
}: {
  c: Copy;
  lang: Lang;
  announce: (message: string) => void;
}) {
  const base = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(Date.now());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [place, setPlace] = useState("");
  const [region, setRegion] = useState("");
  const [access, setAccess] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [errors, setErrors] = useState<FormErrors>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function fieldError(key: FormErrors[number]) {
    return errors.includes(key);
  }

  function focusErrors() {
    window.setTimeout(() => summaryRef.current?.focus(), 40);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (sending) return;
    if (isHoneypotTripped(honeypot) || wasFilledTooFast(startedAt.current)) {
      setErrors([]);
      setSent(false);
      return;
    }
    if (isJoinRateLimited()) {
      setErrors(["rate"]);
      setSent(false);
      announce(c.form.errors.rate);
      focusErrors();
      return;
    }
    const next: FormErrors = [];
    if (!sanitizeText(name, FIELD_LIMITS.name).trim()) next.push("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizeText(email, FIELD_LIMITS.email).trim())) {
      next.push("email");
    }
    if (!region) next.push("region");
    if (sanitizeText(message, FIELD_LIMITS.message).trim().length < 8) next.push("message");
    if (!consent) next.push("consent");
    if (HCAPTCHA_SITE_KEY && !captchaToken) next.push("captcha");
    setErrors(next);
    if (next.length) {
      setSent(false);
      announce(fill(c.form.errorCount, next.length));
      focusErrors();
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          organisation,
          place,
          region,
          access,
          message,
          consent,
          lang,
          website: honeypot,
          captchaToken,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: FormErrors;
      };
      if (!response.ok || !data.ok) {
        const serverFields = Array.isArray(data.fields) ? data.fields.filter((field) => field !== "captcha" || HCAPTCHA_SITE_KEY) : [];
        if (data.error === "captcha") setErrors(["captcha"]);
        else if (data.error === "rate" || response.status === 429) setErrors(["rate"]);
        else if (data.error === "unconfigured") setErrors(["unconfigured"]);
        else if (serverFields.length) setErrors(serverFields);
        else setErrors(["send"]);
        setSent(false);
        const notice =
          data.error === "captcha"
            ? c.form.errors.captcha
            : data.error === "unconfigured"
              ? c.form.errors.unconfigured
              : data.error === "rate" || response.status === 429
                ? c.form.errors.rate
                : serverFields.length
                  ? fill(c.form.errorCount, serverFields.length)
                  : c.form.errors.send;
        announce(notice);
        focusErrors();
        return;
      }
      recordJoinPrepare();
      setSent(true);
      announce(c.form.successTitle);
      trackEvent("join-submit", { region, language: lang });
    } catch {
      setErrors(["send"]);
      setSent(false);
      announce(c.form.errors.send);
      focusErrors();
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="join" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16" aria-labelledby="join-title">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <h2 id="join-title" className="section-title">
            {c.joinTitle}
          </h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed sm:text-lg">{c.joinIntro}</p>
          <p className="mt-6 flex min-w-0 items-center gap-2 font-semibold">
            <Mail aria-hidden="true" className="size-5 shrink-0" />
            <a className="break-all text-accent underline" href={`mailto:${NETWORK_EMAIL}`}>
              {NETWORK_EMAIL}
            </a>
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-line bg-surface p-4 sm:p-6 lg:col-span-8">
          {sent ? (
            <div role="status" className="flex flex-col items-center py-8 text-center">
              <MessageSentMark />
              <h3 className="text-xl sm:text-2xl">{c.form.successTitle}</h3>
            </div>
          ) : (
            <form className="relative" noValidate onSubmit={onSubmit} autoComplete="on">
              {errors.length > 0 && (
                <div
                  ref={summaryRef}
                  tabIndex={-1}
                  role="alert"
                  className="mb-5 rounded-lg border-2 border-danger p-4"
                >
                  <h3 id={`${base}-errors`} className="text-lg">
                    {errors.length === 1 && (errors[0] === "rate" || errors[0] === "send" || errors[0] === "unconfigured")
                      ? c.form.errors[errors[0]]
                      : c.form.errorHeading}
                  </h3>
                  {errors.length === 1 && (errors[0] === "rate" || errors[0] === "send" || errors[0] === "unconfigured") ? null : (
                    <>
                  <p className="mt-1">{fill(c.form.errorCount, errors.length)}</p>
                  <ul className="mt-2 grid gap-1 ps-5">
                    {errors.map((key) => (
                      <li key={key} className="list-disc">
                        {key === "rate" || key === "send" || key === "unconfigured" ? (
                          c.form.errors[key]
                        ) : (
                          <a className="text-accent underline" href={`#${base}-${key}`}>
                            {c.form.errors[key]}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                    </>
                  )}
                </div>
              )}
              <div className="absolute -left-[10000px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor={`${base}-website`}>Website</label>
                <input
                  id={`${base}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id={`${base}-name`}
                  label={c.form.name}
                  note={c.form.required}
                  needed
                  error={fieldError("name") ? c.form.errors.name : ""}
                >
                  <input
                    id={`${base}-name`}
                    className="field"
                    name="name"
                    autoComplete="name"
                    maxLength={FIELD_LIMITS.name}
                    value={name}
                    aria-invalid={fieldError("name")}
                    aria-describedby={fieldError("name") ? `${base}-name-error` : undefined}
                    onChange={(event) => setName(sanitizeText(event.target.value, FIELD_LIMITS.name))}
                  />
                </Field>
                <Field
                  id={`${base}-email`}
                  label={c.form.email}
                  note={c.form.required}
                  needed
                  error={fieldError("email") ? c.form.errors.email : ""}
                >
                  <input
                    id={`${base}-email`}
                    className="field"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={FIELD_LIMITS.email}
                    value={email}
                    aria-invalid={fieldError("email")}
                    aria-describedby={fieldError("email") ? `${base}-email-error` : undefined}
                    onChange={(event) => setEmail(sanitizeText(event.target.value, FIELD_LIMITS.email))}
                  />
                </Field>
                <Field id={`${base}-org`} label={c.form.organisation} note={c.form.optional}>
                  <input
                    id={`${base}-org`}
                    className="field"
                    maxLength={FIELD_LIMITS.organisation}
                    name="organization"
                    autoComplete="organization"
                    value={organisation}
                    onChange={(event) =>
                      setOrganisation(sanitizeText(event.target.value, FIELD_LIMITS.organisation))
                    }
                  />
                </Field>
                <Field id={`${base}-place`} label={c.form.place} note={c.form.optional}>
                  <input
                    id={`${base}-place`}
                    className="field"
                    name="country-name"
                    autoComplete="country-name"
                    maxLength={FIELD_LIMITS.place}
                    value={place}
                    onChange={(event) => setPlace(sanitizeText(event.target.value, FIELD_LIMITS.place))}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field
                  id={`${base}-region`}
                  label={c.form.region}
                  note={c.form.required}
                  needed
                  hint={c.form.regionHint}
                  error={fieldError("region") ? c.form.errors.region : ""}
                >
                  <select
                    id={`${base}-region`}
                    className="field"
                    name="region"
                    value={region}
                    aria-invalid={fieldError("region")}
                    aria-describedby={
                      fieldError("region")
                        ? `${base}-region-hint ${base}-region-error`
                        : `${base}-region-hint`
                    }
                    onChange={(event) => setRegion(event.target.value)}
                  >
                    <option value="">{c.form.regionPlaceholder}</option>
                    {JOIN_CHANNEL_IDS.map((id) => (
                      <option key={id} value={id}>
                        {joinChannelLabel(id, lang)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="mt-4">
                <Field
                  id={`${base}-access`}
                  label={c.form.access}
                  note={c.form.optional}
                  hint={c.form.accessHint}
                >
                  <textarea
                    id={`${base}-access`}
                    className="field"
                    maxLength={FIELD_LIMITS.access}
                    value={access}
                    aria-describedby={`${base}-access-hint`}
                    onChange={(event) => setAccess(sanitizeText(event.target.value, FIELD_LIMITS.access))}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field
                  id={`${base}-message`}
                  label={c.form.message}
                  note={c.form.required}
                  needed
                  hint={c.form.messageHint}
                  error={fieldError("message") ? c.form.errors.message : ""}
                >
                  <textarea
                    id={`${base}-message`}
                    className="field"
                    maxLength={FIELD_LIMITS.message}
                    value={message}
                    aria-invalid={fieldError("message")}
                    aria-describedby={
                      fieldError("message")
                        ? `${base}-message-hint ${base}-message-error`
                        : `${base}-message-hint`
                    }
                    onChange={(event) => setMessage(sanitizeText(event.target.value, FIELD_LIMITS.message))}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <label className="flex min-h-12 items-start gap-3" htmlFor={`${base}-consent`}>
                  <input
                    id={`${base}-consent`}
                    className="mt-1 size-5"
                    type="checkbox"
                    checked={consent}
                    aria-invalid={fieldError("consent")}
                    aria-describedby={fieldError("consent") ? `${base}-consent-error` : undefined}
                    onChange={(event) => setConsent(event.target.checked)}
                  />
                  <span>
                    {c.form.consent} <span className="text-danger">({c.form.required})</span>
                  </span>
                </label>
                {fieldError("consent") && (
                  <p id={`${base}-consent-error`} className="mt-2 flex items-start gap-2 text-danger">
                    <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    {c.form.errors.consent}
                  </p>
                )}
              </div>
              <div id={`${base}-captcha`}>
                <CaptchaBox onToken={setCaptchaToken} />
                {fieldError("captcha") && (
                  <p id={`${base}-captcha-error`} className="mt-2 flex items-start gap-2 text-danger">
                    <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    {c.form.errors.captcha}
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-primary mt-5 w-full sm:w-auto" disabled={sending}>
                {sending ? c.form.sending : c.form.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  note,
  needed,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  note: string;
  needed?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block font-semibold" htmlFor={id}>
        {label}{" "}
        <span className={needed ? "text-danger" : "text-muted"}>({note})</span>
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-2 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-danger">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function Footer({ c, lang, pathname }: { c: Copy; lang: Lang; pathname: string }) {
  const current = stripLang(pathname);
  return (
    <footer id="privacy" className="site-footer bg-inverse text-inverse-fg">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <img
              src="/logo.webp"
              alt=""
              width={56}
              height={56}
              className="logo-mark size-12 shrink-0 rounded-full sm:size-14"
            />
            <p className="font-display text-xl font-semibold sm:text-2xl">EU YPS</p>
          </div>
          <p className="mt-3 max-w-prose text-sm leading-relaxed sm:text-base">{c.footerBlurb}</p>
          <nav aria-label={c.socialTitle} className="mt-4">
            <h2 className="text-lg">{c.socialTitle}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((item) => {
                const Icon = socialIcons[item.id];
                return (
                  <li key={item.id}>
                    <a
                      className="icon-btn border-inverse-fg/40 bg-transparent text-inverse-fg hover:bg-inverse-fg/10"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={c.social[item.id]}
                      data-umami-event={`${item.id}-click`}
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <nav aria-label={c.footerNav}>
          <h2 className="text-lg">{c.footerNav}</h2>
          <ul className="mt-3 grid gap-1">
            <li>
              <Link
                className="inline-flex min-h-12 items-center underline"
                to={localizePath("/", lang)}
                aria-current={current === "/" ? "page" : undefined}
              >
                {c.aboutTitle}
              </Link>
            </li>
            {c.nav.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-12 items-center underline"
                  to={localizePath(item.href, lang)}
                  aria-current={current === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-lg">{c.contactTitle}</h2>
          <p className="mt-3">
            <a
              className="inline-flex min-h-12 max-w-full items-center gap-2 underline"
              href={`mailto:${NETWORK_EMAIL}`}
              data-umami-event="contact-email"
              data-umami-event-placement="footer"
            >
              <Mail aria-hidden="true" className="size-5 shrink-0" />
              <span className="break-all">{NETWORK_EMAIL}</span>
            </a>
          </p>
          <p className="mt-1">
            <a className="inline-flex min-h-12 items-center underline" href={SITE_URL}>
              {SITE_DOMAIN}
            </a>
          </p>
          <h2 className="mt-4 text-lg">{c.privacyTitle}</h2>
          <p className="mt-2 max-w-prose">{c.privacy}</p>
        </div>
      </div>
      <div className="border-t border-inverse-fg/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {c.rights}</p>
          <p>
            {c.madeBy}{" "}
            <a
              className="underline underline-offset-2 hover:opacity-90"
              href="https://www.linkedin.com/in/obada-tarazi/"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="linkedin-click"
              data-umami-event-placement="footer-credit"
            >
              {c.madeByName}
            </a>
            <span aria-hidden="true"> · </span>
            <a
              className="underline underline-offset-2 hover:opacity-90"
              href="https://cupcoding.com"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="cupcoding-click"
              data-umami-event-placement="footer-credit"
            >
              {c.madeBySite}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

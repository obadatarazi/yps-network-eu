# YPS Asia-Pacific & Global Network Website Specifications & AI Master Prompt

## Part 1: Comprehensive Information & Background

### 1. Executive Overview
The **Youth, Peace, and Security (YPS) Agenda** is a global movement anchored in UN Security Council Resolution 2250 (UNSCR 2250) adopted in 2015, alongside Resolutions 2419 (2018) and 2535 (2020). Operating at the intersection of international diplomacy and grassroots youth action, the network connects youth-led peacebuilding initiatives across regions—including Asia-Pacific, Europe, Africa, Latin America, and the Middle East—with key multilateral partners such as the European Union (EEAS) and Search for Common Ground (SFCG).

### 2. Verified Network Metrics & Global Structure
* **Global Footprint:** 50+ Member Organisations across 20+ Countries.
* **Direct Reach:** 1,000+ Young Leaders and Peacebuilders directly engaged.
* **Regional Hubs:** 
  * Asia & Middle East Hub (Asia-Pacific Focus)
  * Europe Hub (European Youth Peace and Security Network - EYPS)
  * West Africa, Central Africa, Eastern & Southern Africa Hubs
  * Latin America & Caribbean Hub
* **Core Contact & Inquiries:** `info@eypsnetwork.eu`

### 3. Strategic Framework: The 5 Core Pillars
1. **Participation:** Ensuring young peacebuilders actively participate in political, diplomatic, and policy decision-making processes at local, regional, and international levels.
2. **Protection:** Safeguarding young peacebuilders, climate defenders, and human rights activists from violence and shrinking civic space.
3. **Prevention:** Addressing root causes of violence, violent extremism, hate speech, and climate-induced conflict through community-led youth programs.
4. **Partnerships:** Linking youth networks with multilateral bodies (EU, UN, ASEAN, Pacific Islands Forum) and national civil society organizations.
5. **Disengagement & Reintegration:** Facilitating positive social reintegration and civic empowerment for youth vulnerable to armed conflict or radicalization.

### 4. Key Regional Priorities for Asia-Pacific
* **Climate, Peace, and Security (CPS):** Integrating climate displacement, disaster risk management, and peacebuilding in vulnerable island states and coastal regions.
* **Digital Peacebuilding & Cyber Safety:** Tackling online hate speech, disinformation, and digital violence while expanding equitable digital access.
* **Inclusion of Persons with Disabilities (PWDs):** Actively promoting youth with disabilities in peace processes and ensuring intersectional advocacy.

---

## Part 2: Accessibility & Inclusive Design Matrix

| Category | Standard / Requirement | Implementation Directive |
| :--- | :--- | :--- |
| **Visual Impairments** | Screen Reader Support (ARIA) | Semantic HTML5 tags (`<main>`, `<nav>`, `<article>`), explicit `aria-label`, `alt` tags on all images, screen-reader only text (`.sr-only`). |
| **Color Vision Deficiency** | High Contrast & Non-color reliance | Minimum contrast ratio 4.5:1 for body text (WCAG AA). Never rely on color alone to indicate state (use text + icons). |
| **Motor Disabilities** | Keyboard Navigation & Touch Targets | Full keyboard accessibility (`Tab`, `Shift+Tab`, `Enter`, `Space`). Minimum touch target size of **48x48px** with adequate padding. |
| **Cognitive & Neurodiversity** | Reduced Motion & Readability | Honor `prefers-reduced-motion` CSS media query. Clear typography hierarchy, plain language option, no auto-playing audio/video. |
| **Low Bandwidth / Mobile** | Offline & Mobile Performance | Optimized assets, fast loading, zero cumulative layout shift (CLS < 0.1). |

---

## Part 3: Production AI Master Prompt

> **Copy and paste the prompt block below into an AI coding assistant (e.g., Claude, ChatGPT, Cursor, or Gemini) to generate the complete code.**

```text
You are an expert Principal Web Developer and UI/UX Accessibility Specialist (WCAG 2.1 AA certified).

TASK:
Build a fully functional, highly responsive, mobile-first, and ultra-accessible Single Page Application (SPA) HTML/CSS/JS file for "YPS Asia-Pacific & Global Network" (Youth, Peace, and Security Community).

DATA INTEGRATION REQUIREMENTS:
- Integrate global metrics: 50+ Member Organisations, 20+ Countries, 15+ Major Events, 1000+ Youth Reached.
- Highlight regional linkages between Asia-Pacific, Europe (EYPS), Africa, Latin America, and Middle East hubs.
- Feature partnerships with Search for Common Ground (SFCG) and European Union Youth Policy frameworks.

CORE SPECIFICATIONS & ARCHITECTURE:
1. Single-File Requirement: Produce everything within ONE single self-contained HTML file (using embedded CSS in <style> and vanilla JS in <script> or Tailwind CSS via CDN).
2. Mobile-First Approach: Mobile-optimized touch targets (minimum 48x48px), responsive drawer/hamburger navigation, fluid layout typography, zero horizontal scrolling.
3. Strict Accessibility (WCAG 2.1 AA Standards):
   - Semantic HTML5 structure (<header>, <nav>, <main>, <section>, <article>, <footer>).
   - Skip to Main Content link at the top (<a href="#main-content" class="skip-link">Skip to main content</a>).
   - Complete ARIA support: aria-expanded, aria-controls, aria-current="page", role="region", and dynamic live region (aria-live="polite") for dynamic updates.
   - Contrast Ratios: > 4.5:1 for standard text, > 3:1 for large headings.
   - High Contrast Mode Toggle: Add an accessible "High Contrast / Accessibility Mode" toggle button.
   - Screen Reader Text: Include `.sr-only` class for context where visual context exists.
   - Keyboard Navigation: Visible focus outlines (:focus-visible) with minimum 3px offset outline. Respect `prefers-reduced-motion`.

DESIGN & BRAND VOICE:
- Color Palette: Deep Peace Blue (#003366), Vibrant Cyan (#0099CC), Warm Gold Accent (#F4B400), Neutral Dark (#1A1A1A), Light Background (#F8F9FA).
- Fonts: Sans-serif system font stack (Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto).

WEBSITE STRUCTURE & SECTIONS:
1. Accessibility Toolbar (Top Bar): Font-size adjuster (A-, A+), High Contrast Toggle, Skip Link.
2. Header & Nav: Logo badge ("YPS Asia-Pacific & Global Network"), Navigation Menu, Mobile Menu Toggle Button (with proper ARIA states).
3. Hero Section:
   - Heading: "Empowering Youth, Building Peace Across Asia-Pacific and the World"
   - Subheading: "Unifying young peacebuilders, climate defenders, and advocates in line with UNSCR 2250 and international youth agendas."
   - Action Buttons: "Join Global Network" (Primary) & "Explore 5 Pillars" (Secondary).
   - Live Metrics Bar: "50+ Member Organisations | 20+ Countries | 1,000+ Youth Engaged"
4. The 5 Pillars Section (Interactive Grid):
   - Participation, Protection, Prevention, Partnerships, Disengagement & Reintegration.
   - Card layout accessible via keyboard (`Enter`/`Space` key controls).
5. Regional Hubs & Global Alliances:
   - Interactive focus tabs: Asia & Middle East, Europe (EYPS), Africa, Latin America & Caribbean.
6. Special Focus: Disability Inclusion & Climate-Peace Nexus spotlight section.
7. Resource & Toolkit Hub: Filterable list of downloadable PDFs, policy briefs, and accessible toolkits.
8. Inclusive Contact & Join Form:
   - Form with explicit <label> associations, clear error messaging via `aria-describedby` and `aria-invalid`.
   - Dedicated field asking for accessibility accommodations for incoming members.
   - Network email indicator (`info@eypsnetwork.eu`).
9. Accessible Footer: Quick links, copyright, privacy notice, social media icons with descriptive `aria-label`s.

Deliver clean, semantic, well-commented, production-ready single-file HTML code.
```

---

## Part 4: UI/UX & Structural Checklist for Developers

* [ ] Has a `skip-to-main` navigation link at the top of the body.
* [ ] All dynamic UI controls (mobile menu, modals, accordions) update `aria-expanded="true/false"`.
* [ ] Focus outlines are distinct and visible (`outline: 3px solid #0056b3`).
* [ ] Color is never the sole indicator for error or state changes.
* [ ] All interactive buttons are at least `48px` tall and wide for touch accessibility on mobile devices.
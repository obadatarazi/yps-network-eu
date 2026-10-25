import { teamImage, type TeamMemberCopy } from "@/lib/team";

export const NETWORK_EMAIL = "euypsnet@gmail.com";
export const SITE_DOMAIN = "euypsnet.org";
export const SITE_URL = `https://${SITE_DOMAIN}`;

/** Verified EU YPS Coalition channels (closest public profiles for the Europe hub). */
export const SOCIAL_LINKS = [
  {
    id: "linkedin" as const,
    href: "https://www.linkedin.com/company/eu-youth-peace-and-security-coalition",
  },
  {
    id: "instagram" as const,
    href: "https://www.instagram.com/euypscoalition/",
  },
] as const;

export type SocialId = (typeof SOCIAL_LINKS)[number]["id"];
export type Lang = "en" | "ar";
export type PillarId =
  | "participation"
  | "protection"
  | "prevention"
  | "partnerships"
  | "reintegration";
export type HubId =
  | "west-africa"
  | "central-africa"
  | "esa"
  | "europe"
  | "lac"
  | "asia-me";
export type ResourceKind = "brief" | "toolkit" | "training";

export type Copy = {
  skip: string;
  accessibility: string;
  openAccessibility: string;
  closeAccessibility: string;
  textSize: string;
  smaller: string;
  larger: string;
  contrast: string;
  contrastShort: string;
  contrastOn: string;
  plain: string;
  plainShort: string;
  plainOn: string;
  language: string;
  tagline: string;
  switchLangLabel: string;
  switchLangShort: string;
  openMenu: string;
  closeMenu: string;
  primaryNav: string;
  mobileNav: string;
  nav: { href: string; label: string }[];
  joinCta: string;
  exploreCta: string;
  kicker: string;
  title: string;
  sub: string;
  plainSub: string;
  photoCaption: string;
  photoDetail: string;
  photoAlt: string;
  metrics: { value: string; label: string }[];
  aboutTitle: string;
  about: string;
  aboutPlain: string;
  resolutions: { code: string; year: string; text: string }[];
  partnersLabel: string;
  partners: string;
  pillarsTitle: string;
  pillarsIntro: string;
  pillarsHint: string;
  showing: string;
  hubsTitle: string;
  hubsIntro: string;
  hubsHint: string;
  upcomingTitle: string;
  upcomingIntro: string;
  upcoming: {
    id: string;
    title: string;
    when: string;
    where: string;
    summary: string;
    documents: { label: string; href: string }[];
  }[];
  focusTitle: string;
  focusIntro: string;
  focus: {
    title: string;
    text: string;
    plain: string;
    image: string;
    alt: string;
    caption: string;
  }[];
  resourcesTitle: string;
  resourcesIntro: string;
  filters: { id: "all" | ResourceKind; label: string }[];
  filterLabel: string;
  resultCount: string;
  emptyResources: string;
  download: string;
  downloadFile: string;
  printPdf: string;
  downloading: string;
  downloaded: string;
  kindLabel: Record<ResourceKind, string>;
  teamTitle: string;
  teamIntro: string;
  teamReadMore: string;
  teamClose: string;
  teamDialogLabel: string;
  team: TeamMemberCopy[];
  joinTitle: string;
  joinIntro: string;
  form: {
    name: string;
    email: string;
    organisation: string;
    place: string;
    region: string;
    access: string;
    accessHint: string;
    message: string;
    messageHint: string;
    regionHint: string;
    consent: string;
    required: string;
    optional: string;
    submit: string;
    sending: string;
    regionPlaceholder: string;
    errors: Record<"name" | "email" | "region" | "message" | "consent" | "captcha" | "rate" | "send" | "unconfigured", string>;
    errorHeading: string;
    errorCount: string;
    successTitle: string;
    noneStated: string;
    popups: string;
  };
  footerBlurb: string;
  footerNav: string;
  socialTitle: string;
  social: Record<SocialId, string>;
  privacyTitle: string;
  privacy: string;
  contactTitle: string;
  backToTop: string;
  sitemapLabel: string;
  llmsLabel: string;
  rights: string;
  madeBy: string;
  madeByName: string;
  madeBySite: string;
  announced: {
    lang: string;
    contrastOn: string;
    contrastOff: string;
    plainOn: string;
    plainOff: string;
    smaller: string;
    larger: string;
    limit: string;
    menuOpen: string;
    menuClose: string;
    a11yOpen: string;
    a11yClose: string;
    resources: string;
  };
  pillars: {
    id: PillarId;
    title: string;
    lede: string;
    body: string;
    plain: string;
    points: string[];
  }[];
  hubs: {
    id: HubId;
    title: string;
    lede: string;
    body: string;
    plain: string;
    points: string[];
  }[];
  resources: {
    id: string;
    kind: ResourceKind;
    title: string;
    summary: string;
    body: string;
    /** Public path to a real file (e.g. `/documents/agenda.pdf`). When set, visitors download that file. */
    fileHref?: string;
  }[];
};

const en: Copy = {
  skip: "Skip to main content",
  accessibility: "Accessibility options",
  openAccessibility: "Open accessibility options",
  closeAccessibility: "Close accessibility options",
  textSize: "Text size",
  smaller: "Smaller text",
  larger: "Larger text",
  contrast: "High contrast",
  contrastShort: "Contrast",
  contrastOn: "High contrast on",
  plain: "Plain language",
  plainShort: "Plain",
  plainOn: "Plain language on",
  language: "Language",
  tagline: "Youth, Peace and Security Network",
  switchLangLabel: "اقرأ هذه الصفحة بالعربية",
  switchLangShort: "عربي",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  primaryNav: "Primary",
  mobileNav: "Mobile",
  nav: [
    { href: "/pillars", label: "Pillars" },
    { href: "/regions", label: "Regions" },
    { href: "/team", label: "Meet the Team" },
    { href: "/activities", label: "Activities" },
    { href: "/resources", label: "Resources" },
    { href: "/join", label: "Join" },
  ],
  joinCta: "Join the network",
  exploreCta: "Explore the 5 pillars",
  kicker: "EU Youth, Peace and Security Network",
  title: "Youth at the forefront of peace and security across regions in the world",
  sub: "Empowering young people to build inclusive, peaceful and resilient societies in line with the United Nations Youth, Peace and Security Agenda.",
  plainSub:
    "This network helps young people build peaceful and fair societies. It follows the United Nations Youth, Peace and Security Agenda.",
  photoCaption: "Member coordination",
  photoDetail: "Young peacebuilders compare notes across regions.",
  photoAlt:
    "Young adults from several regions sit around a wooden table in a sunlit hall, reviewing paper maps and notebooks.",
  metrics: [
    { value: "50+", label: "Member Organisations" },
    { value: "20+", label: "Countries" },
    { value: "15+", label: "Events" },
    { value: "1000+", label: "Youth Reached" },
  ],
  aboutTitle: "Who We Are",
  about:
    "The European Youth Peace and Security Network (EYPS Network) is an international network of young activists, advocates, researchers, and changemakers present in more than 82 countries around the world. Founded on the principles and values of the United Nations Youth, Peace and Security (YPS) Agenda — which the European Union helps implement — the network serves as a global platform for dialogue, cooperation, and collective action, enabling young people to actively contribute to the promotion of peace, human security, social cohesion, and sustainable development. Our vision is a world where every young person can help build peaceful, inclusive, and resilient societies. Our mission is to mobilize, connect, and empower young people so they can take part meaningfully in peace, security, and sustainable development.",
  aboutPlain:
    "The European Youth Peace and Security Network brings together young activists, advocates, researchers, and changemakers in more than 82 countries. It follows the United Nations Youth, Peace and Security Agenda, which the European Union helps implement. We want every young person to help build peaceful societies, and we work to connect and empower young people so their voices shape peace and security decisions.",
  resolutions: [
    { code: "2250", year: "2015", text: "Recognises young people as partners in preventing conflict and building peace." },
    { code: "2419", year: "2018", text: "Calls for youth participation when peace agreements are negotiated and carried out." },
    { code: "2535", year: "2020", text: "Asks the UN system to report on protection, participation, and the work still undone." },
  ],
  partnersLabel: "Alongside",
  partners: "United Nations Youth, Peace and Security Agenda · Member organisations",
  pillarsTitle: "Five pillars",
  pillarsIntro:
    "The Youth, Peace and Security Agenda is organised around five commitments. Open a pillar to read what it asks of the network in practice.",
  pillarsHint: "Vertical tabs. Use Up and Down arrow keys to move. Enter or Space also selects.",
  showing: "Now reading",
  hubsTitle: "Our Regions",
  hubsIntro:
    "The EYPS Network is present in more than 82 countries. To ensure inclusive representation, effective coordination, and a better understanding of local realities, the network relies on a dynamic regional structure coordinated by Regional Administrators.",
  hubsHint: "Horizontal tabs. Use Left and Right arrow keys to move.",
  upcomingTitle: "Upcoming activities",
  upcomingIntro:
    "Programmes and concept notes for the next network events. Download the PDFs to prepare or share with members.",
  upcoming: [
    {
      id: "esa-webinar-2026",
      title: "East & Southern Africa regional webinar",
      when: "Thursday, 16 October 2026 · 6:00–8:00 PM EAT",
      where: "Virtual · East & Southern Africa hub",
      summary:
        "A practical EU YPS Network session on misinformation, disinformation and malinformation, with Kenya as the main case study and brief comparisons from the wider region — including a live verification exercise and an AmaniCheck demonstration.",
      documents: [
        {
          label: "Concept note (PDF)",
          href: "/documents/ESA_Regional_Webinar_Concept_Note_16_Oct_2026.pdf",
        },
        {
          label: "Draft programme (PDF)",
          href: "/documents/ESA_Regional_Webinar_Program_16_Oct_2026.pdf",
        },
      ],
    },
  ],
  focusTitle: "What we work on",
  focusIntro:
    "Through initiatives, partnerships, and spaces for exchange, we strengthen the meaningful participation of young people in decision-making at local, regional, and international levels.",
  focus: [
    {
      title: "Promote dialogue",
      text: "We encourage meaningful youth participation in policy and decision-making, creating spaces where young people can share experiences, develop solutions, and make their voices heard.",
      plain:
        "We help young people take part in policy talks and decisions, share ideas, and be heard.",
      image: "/images/climate.webp",
      alt: "Young people stand on a sandy shoreline at late afternoon, looking toward mangroves and low clouds. Some hold notebooks.",
      caption: "Dialogue that links local voices to wider decision-making.",
    },
    {
      title: "Foster inclusion",
      text: "We work for diverse representation and equal opportunities so young people from different backgrounds, cultures, and experiences can take part fully in peace and security processes.",
      plain:
        "We make sure many kinds of young people are present and treated fairly in peace and security work.",
      image: "/images/inclusion.webp",
      alt: "A young woman using a wheelchair speaks at a round table while other young people listen, notebooks open, in a bright meeting room.",
      caption: "Inclusion planned into every process, not added at the door.",
    },
    {
      title: "Build capacity and networks",
      text: "We provide training and resources for young peacebuilders and leaders, and we connect youth and organisations across borders so cooperation and collective action have greater impact.",
      plain:
        "We offer training and tools, and we link young people and organisations across borders.",
      image: "/images/digital.webp",
      alt: "Two young people sit close in a modest community media room, looking together at a laptop. One wears headphones.",
      caption: "Skills, opportunities, and cross-border connections.",
    },
  ],
  resourcesTitle: "Briefs and toolkits",
  resourcesIntro:
    "Short texts you can download or print. They are plain-language starting points for members, not official UN documents.",
  filters: [
    { id: "all", label: "All" },
    { id: "brief", label: "Policy briefs" },
    { id: "toolkit", label: "Toolkits" },
    { id: "training", label: "Training notes" },
  ],
  filterLabel: "Filter resources",
  resultCount: "{n} resources shown",
  emptyResources: "Nothing in this group yet.",
  download: "Download text",
  downloadFile: "Download PDF",
  printPdf: "Print or save as PDF",
  downloading: "Downloading…",
  downloaded: "Downloaded",
  kindLabel: {
    brief: "Policy brief",
    toolkit: "Toolkit",
    training: "Training note",
  },
  teamTitle: "Regional Administrators",
  teamIntro:
    "Meet the people coordinating the European Youth, Peace and Security Network — general coordination, regional administrators, and communication.",
  teamReadMore: "Read more",
  teamClose: "Close biography",
  teamDialogLabel: "Team member biography",
  team: [
    {
      id: "rok-kozelj",
      name: "Rok Koželj",
      role: "Member of the General Coordination Office",
      image: teamImage("rok-kozelj"),
      alt: "Portrait of Rok Koželj",
      bio: "Born in 1976, Slovenian and Italian, I studied Political Science in Torino and worked in the EU Institutions since 2006:\n\nEuropean Parliament (2006 – 2021): Responsible for several EP Delegations for Relations with third countries: Iraq, Maghreb, Mashreq, South Africa, Parliamentary Assembly Union for the Mediterranean and Joint Parliamentary Assembly Africa, Caribbean and the Pacific, where I was responsible for its Social and Environmental Committee and its Youth Fora.\n\nEuropean External Action Service (2021 – present day): Responsible for the Summits and Ministerial Meetings EU – African Union and, more recently, responsible for fragility, human rights due diligence policy, humanitarian-development-peace nexus and Youth, Peace and Security.\n\nHelped to setup the Africa – Europe Youth Core Group in 2022. Setup the EU Youth, Peace and Security network in 2025.\n\nLanguages: Slovenian, Italian, English and French.\n\nPersonal: Married with 4 children. Hobbies: computer programming and mountains.",
    },
    {
      id: "bouraima-kabore",
      name: "Bouraïma Kaboré",
      role: "Regional Administrator – West Africa",
      image: teamImage("bouraima-kabore"),
      alt: "Portrait of Bouraïma Kaboré",
      bio: "Bouraïma Kaboré is a project management expert, business development consultant and dedicated advocate for peace, security and social cohesion in Burkina Faso. He holds a Bachelor's degree in Management and Project Management and is currently completing a Master's degree (Master II), alongside several professional certifications in business consulting, monitoring and evaluation, and international consultancy.\n\nWith more than twenty years of community engagement, he has actively contributed to conflict prevention, youth participation in peacebuilding processes, and the promotion of UN Security Council Resolution 2250 on Youth, Peace and Security. He is Founder and President of the Association of Young People for the Promotion of Peace and Reconciliation in the Centre-West Region, and serves as the Youth, Peace and Security Focal Point for UNOWAS.\n\nAs Regional Administrator for West Africa within the European Youth, Peace and Security Network, he is committed to strengthening interregional partnerships, promoting youth leadership and advancing the effective implementation of the Youth, Peace and Security Agenda at the local, national, regional and international levels.",
    },
    {
      id: "bertin-cituli",
      name: "Bertin Cituli",
      role: "Regional Administrator – Central Africa",
      image: teamImage("bertin-cituli"),
      alt: "Portrait of Bertin Cituli",
      bio: "Country: DR Congo. Current positions: Deputy National Coordinator, Women for Equal Chances-Congo (WEC-CONGO); Teacher of English; Regional Administrator, EU-YPS Network / Central Africa (volunteering); Programme Manager, Africa-Europe Youth Core Group (volunteering); Country Representative, Youth4Youth Africa (volunteering).\n\nBertin Cituli is a young peacebuilder, environmental specialist, feminist and educator from the Democratic Republic of the Congo. He holds a BA (+5 years) in English and African Culture and is a McKinsey Forward (USA) alumnus.\n\nAs Deputy National Coordinator of Women for Equal Chances-Congo, Programme Manager of the Africa-Europe Youth Core Group and Country Representative of Youth4Youth Africa, he actively promotes youth participation, human rights and sustainable peace. As Regional Administrator for Central Africa within the European Youth, Peace and Security Network, he is committed to advancing the Youth, Peace and Security Agenda through inclusive leadership, regional collaboration and meaningful youth engagement across Africa, Europe and beyond.",
    },
    {
      id: "fatuma-adokorach",
      name: "Fatuma Adokorach",
      role: "Regional Administrator – Eastern and Southern Africa",
      image: teamImage("fatuma-adokorach"),
      alt: "Portrait of Fatuma Adokorach",
      bio: "Fatuma Adokorach is a Ugandan youth leader, peacebuilder and community advocate committed to advancing inclusive peace, justice and resilience in conflict-affected communities (Gulu, Northern Uganda). She is pursuing a Bachelor's Degree in International Relations and Security Studies at Gulu University, where her research focuses on regional integration as a pathway to peace and security in East Africa.\n\nHer work centres on youth empowerment, peacebuilding, human rights and community development. She has actively contributed to youth-led initiatives such as the Youth Advocacy Network and Rocco Paco, promoting civic engagement and meaningful participation in peace processes.\n\nCurrently serving as Regional Administrator for Eastern and Southern Africa within the European Youth, Peace and Security Network, she supports coordination and engagement across the region. Fatuma is motivated to strengthen youth voices, foster collaboration, and advance the Youth, Peace and Security Agenda through inclusive and sustainable approaches.",
    },
    {
      id: "gebreegziabher-tadele-desalegn",
      name: "Gebreegziabher Tadele Desalegn",
      role: "Regional Administrator – Eastern and Southern Africa",
      image: teamImage("gebreegziabher-tadele-desalegn"),
      alt: "Portrait of Gebreegziabher Tadele Desalegn",
      bio: "Gebreegziabher Tadele Desalegn is a journalist and global peace ambassador from Tigray, Ethiopia, with 13 years of experience. He has earned certificates from international media outlets and institutions including CNN Academy, AFP, Reuters, NBCU Academy, the University of Derby (UK), Indiana University (USA), United Nations University, and the EU International Academy Partnership.\n\nHe is also a global peace ambassador certified by the Institute for Economics and Peace and Global Peace Chain, an ambassador of United Leaders Global and of the My Body is My Body Foundation, and a board member of International Cities of Peace.\n\nHe currently serves as Regional Administrator for Eastern and Southern Africa within the European Youth, Peace and Security Network, and works with international organisations as a volunteer.",
    },
    {
      id: "kasim-ahmed",
      name: "Kasim Ahmed",
      role: "Regional Administrator – Eastern and Southern Africa",
      image: teamImage("kasim-ahmed"),
      alt: "Portrait of Kasim Ahmed",
      bio: "Kasim Ahmed is a passionate, results-oriented development professional from Somalia with a strong commitment to youth empowerment, community development, peacebuilding and sustainable social impact. He has practical experience in project management, leadership, stakeholder engagement and advisory services within the development sector.\n\nHe previously served as Project Manager at SYDPA, coordinating community-based development initiatives, and currently works with European East Africa Advisors as an NGO Advisor, providing strategic guidance to development programs and contributing to regional cooperation initiatives.\n\nHe is pursuing his higher education at Somali National University, Faculty of Veterinary Medicine and Animal Husbandry, complementing his interest in community resilience and sustainable livelihoods.\n\nLanguages: Somali, English and Arabic.",
    },
    {
      id: "ema-mecaj",
      name: "Ema Meçaj",
      role: "Regional Administrator – Europe",
      image: teamImage("ema-mecaj"),
      alt: "Portrait of Ema Meçaj",
      bio: "Ema Meçaj is an Albanian youth activist and medical student with substantial experience in the human rights field, advocating for children's rights, gender equality, peacebuilding and social inclusion. Her engagement with the United Nations and OSCE illustrates her commitment to these causes and her contribution to regional policy-making processes.\n\nHer advocacy spans grassroots organising, international diplomacy and policy influence. She currently serves as the UN Youth Delegate of Albania to the United Nations and previously served as the Youth Delegate of the ECE region to the UN Commission on the Status of Women in New York. She is also an active member of the UN Youth Advisory Group in Albania and a fellow of the UN Youth for Inclusion, Equality & Trust fellowship.\n\nSince 2025, she has been working for the WeBalkans programme, part of the European Commission's Directorate-General for Enlargement. Ema aims to advance equality, solidarity and social justice while bringing the voice of Albanian and Western Balkans youth to regional and global platforms.",
    },
    {
      id: "carol-zakhour",
      name: "Carol Zakhour",
      role: "Regional Administrator – Europe & Asia and Middle East",
      image: teamImage("carol-zakhour"),
      alt: "Portrait of Carol Zakhour",
      bio: "Carol Zakhour is a Syrian women's rights activist, peacebuilder, and social entrepreneur. She is the founder and CEO of Uplifting Syrian Women, an initiative established in 2021 to empower women in Syria by bridging gender gaps in education, employment, and leadership through free online courses, workshops, support groups, and resources. Her work with Uplifting Syrian Women was recognized with the Women in Tech Most Impactful Initiative Award in the MENA Region, and she serves as an Administrator for the EEAS' YPS Network as well as a member of the Mediterranean Youth Council. Academically, she holds a Bachelor of Arts in English Literature and Mass Communication, pursued a diploma in Social Innovation at the University for Peace, and is currently studying for an MA in European Studies with a special focus on EU affairs at UCLouvain.",
    },
    {
      id: "patricia-z-gaye",
      name: "Patricia Z. Gaye",
      role: "Regional Coordinator – West Africa",
      image: teamImage("patricia-z-gaye"),
      alt: "Portrait of Patricia Z. Gaye",
      bio: "Country: Liberia. Region: West Africa. Current positions: Coordinator (YPS); CEO of Tyler’s Farm; medical student; Vice President, ROAJELF Liberia; Co-Chair, African Women Leadership Network (AWLN) Youth Caucus.\n\nPatricia Z. Gaye is a passionate advocate for women and youth leadership, empowerment and peace in Liberia. She currently serves as Coordinator for the EU Community on Youth, Peace and Security (YPS) in West Africa, CEO of Tyler’s Farm, and a medical student. She is dedicated to addressing the under-representation of women and youth in decision-making roles.\n\nHer commitment to building leadership capacity among women and girls is evident through her work as a trainer for the UN Women’s Political Leadership programme, where she and her team trained over 210 women candidates across 15 counties in Liberia. She oversees the Women’s Leadership Clinic, empowering over 500 women to take on leadership positions since its inception in 2020 while serving as Programme Manager at Sister Aid Liberia. Some of these women now occupy top government and non-governmental positions in Liberia.\n\nIn addition, through her roles as Vice President of ROAJELF Liberia and Co-Chair of the African Women Leadership Network (AWLN) Youth Caucus, she is committed to inspiring the next generation of female leaders.\n\nShe holds a BSc degree in Biology and Chemistry from the University of Liberia and is pursuing her medical degree at A.M. Dogliotti College of Medicine, alongside advanced diplomas in Leadership and Management and various certifications in global leadership, project management and women’s political participation.",
    },
    {
      id: "amani-habimana-jospin",
      name: "Amani Habimana Jospin",
      role: "Regional Coordinator – Central Africa",
      image: teamImage("amani-habimana-jospin"),
      alt: "Portrait of Amani Habimana Jospin",
      bio: "Amani Habimana Jospin is a peacebuilding and human rights practitioner from the Great Lakes region, with solid experience working in fragile and conflict-affected contexts across Central Africa. He currently serves as Regional Coordinator of the EU Youth, Peace and Security Network for Central Africa and as a Youth Peace Fellow within the Interpeace Great Lakes Regional Programme. He is also CEO of SELP asbl in DR Congo and DMEL of the National Partnership of Children and Youth in Peacebuilding.\n\nHis work focuses on youth participation, human rights, social cohesion, and the localisation of the Youth, Peace and Security (UNSCR 2250) and Women, Peace and Security (UNSCR 1325) agendas. He has led and supported initiatives on conflict analysis, intergenerational dialogue, policy advocacy and community-based peacebuilding. Through his engagement with local communities, civil society organisations and regional institutions, he promotes inclusive governance and the meaningful participation of young people in peace and development processes throughout Central Africa.",
    },
    {
      id: "yvette-ariwo",
      name: "Yvette Ariwo",
      role: "Regional Coordinator – East and Southern Africa",
      image: teamImage("yvette-ariwo"),
      alt: "Portrait of Yvette Ariwo",
      bio: "Biography details coming soon.",
    },
    {
      id: "hamisi-mwatondo",
      name: "Hamisi Mwatondo",
      role: "Regional Coordinator – Eastern and Southern Africa",
      image: teamImage("hamisi-mwatondo"),
      alt: "Portrait of Hamisi Mwatondo",
      bio: "Hamisi Mwatondo is a peace and security practitioner and MEL specialist working on information integrity on the Kenyan coast. He is currently pursuing a Master's in Communications and Media, building on a BA in International Relations and Diplomacy with IT.\n\nHe is the founder and sole builder of Amani Check, a bilingual (English and Kiswahili) civic AI platform for fact-checking, misinformation resilience and PCVE education, now in pilot ahead of Kenya's 2027 electoral cycle. He has presented the platform at the Pwani University Transdisciplinary Conference and engaged institutions including NCIC and IGAD on how communities can counter misinformation, disinformation and malinformation in local languages and contexts.\n\nHamisi is Programme Manager at Jamii Action Centre in Kwale County, where he leads a team of eight on youth, women and children's participation in decision-making. He is also MEL Officer and Programs Officer at the Kenya Muslim Youth Alliance (KMYA), where his work covers information integrity, PCVE and civic engagement across Kenya. His evidence-based approach draws on peacebuilding practice, data science training from ALX Africa and grassroots work with youth and faith communities. He was a Top 30 Under 30 honouree at the Kenya Climate Innovation Conference (2026) and received the Young Changemakers Award (2025).",
    },
    {
      id: "yairy-vega-muenala",
      name: "Yairy Vega Muenala",
      role: "Regional Coordinator – Latin America and the Caribbean",
      image: teamImage("yairy-vega-muenala"),
      alt: "Portrait of Yairy Vega Muenala",
      bio: "Yairy Vega Muenala is a Kichwa Indigenous advocate from Ecuador whose work has grown from community-based leadership to regional and international engagement on peace, security and inclusive governance. Her perspective is shaped by a community understanding of peace as something sustained through trust, participation, reciprocity and collective responsibility. This has led her to work on strengthening the role of Indigenous women and young people in shaping decisions that affect their communities.\n\nToday, Yairy works across Ecuadorian, regional and European spaces. As an International Cooperation Analyst at Ecuador's Ministry of Foreign Affairs and Human Mobility, she engages with regional and Ibero-American cooperation. As Regional Coordinator for Latin America and the Caribbean within the EU Youth, Peace and Security Network, she connects youth perspectives from the region with broader conversations on peace and security.\n\nShe is also the founder of Huellas de Poder, a community-based initiative supporting Indigenous women's leadership and participation in rural Ecuador and creating spaces to engage with conflict resolution, peace and security. Her work has also included the Andean Community and the EU Delegation in Ecuador.\n\nYairy holds an MA in Global Governance and Diplomacy with Distinction from the University of Leeds and a BA in International Relations, graduating Summa Cum Laude.",
    },
    {
      id: "abdul-rahman-jalil",
      name: "Abdul Rahman Jalil",
      role: "Regional Coordinator – Asia & Middle East",
      image: teamImage("abdul-rahman-jalil"),
      alt: "Portrait of Abdul Rahman Jalil",
      bio: "Abdul Rahman Jalil is a youth activist and human rights defender from Afghanistan, committed to advancing peace and inclusion. As Regional Coordinator of the EU Youth, Peace and Security Network for Asia and the Middle East, he works to connect young activists across borders, fostering dialogue and cooperation on shared challenges.\n\nHe also serves as Programme Manager at Afghans for Progressive Thinking Organization (2022 – present), supporting youth in accessing educational opportunities, advocating on human rights issues, and facilitating safe spaces for dialogue and networking.",
    },
    {
      id: "shan-rasheed",
      name: "Shan Rasheed",
      role: "Communication – Pakistan",
      image: teamImage("shan-rasheed"),
      alt: "Portrait of Shan Rasheed",
      bio: "Shan Rasheed is a youth engagement and peacebuilding professional from Pakistan, passionate about human rights, interfaith harmony, and inclusive youth participation. As Manager of Student Affairs at Khalid Mahmood Institute of Medical Sciences (KIMS), he supports student development and engagement.\n\nPreviously, as Communication & IT Officer at Human Friends Organization (HFO), he contributed to initiatives promoting youth empowerment, Freedom of Religion or Belief (FoRB), and peacebuilding through communication, advocacy, and community engagement.\n\nAs a member of the EU Youth, Peace and Security (YPS) Network, Shan contributes to youth priorities mapping in Pakistan, amplifying young people's voices and promoting their meaningful participation in inclusive dialogue and peacebuilding.",
    },
  ],
  joinTitle: "Join or write to the network",
  joinIntro:
    "Send a message to the network. A confirmation email comes back to you, with the WhatsApp group for the region you choose.",
  form: {
    name: "Full name",
    email: "Email",
    organisation: "Organisation",
    place: "City or country",
    region: "Region",
    access: "Accessibility accommodations",
    accessHint:
      "Optional. Examples: step-free rooms, captions, screen-reader formats, sign language, quieter spaces, or more time.",
    message: "Why you want to connect",
    messageHint: "A few sentences is enough. Say whether you are writing as a person or for an organisation.",
    regionHint: "The confirmation email includes the WhatsApp group for this region.",
    consent: "I agree to send this message to the network and to receive a confirmation email.",
    required: "required",
    optional: "optional",
    submit: "Send message",
    sending: "Sending…",
    regionPlaceholder: "Choose a region",
    errors: {
      name: "Enter your name.",
      email: "Enter an email address like name@example.com.",
      region: "Choose a region.",
      message: "Write a short message so the network knows why you are writing.",
      consent: "Confirm that the network may email you about this message.",
      captcha: "Complete the captcha before sending.",
      rate: "Please wait a few minutes before sending another message.",
      send: "The message could not be sent. Try again in a moment, or email the network directly.",
      unconfigured: "Email is not connected yet. Write to the address above for now.",
    },
    errorHeading: "Fix these fields",
    errorCount: "{n} fields need attention before the message can be sent.",
    successTitle: "Message sent",
    noneStated: "None stated",
    popups: "The print window was blocked. Allow pop-ups or use download instead.",
  },
  footerBlurb:
    "The European Youth Peace and Security Network (EYPS Network) mobilises young people worldwide for peace, security, and sustainable development, in line with the United Nations YPS Agenda.",
  footerNav: "Site pages",
  socialTitle: "Social",
  social: {
    linkedin: "EU Youth, Peace and Security Coalition on LinkedIn (opens in a new tab)",
    instagram: "EU Youth, Peace and Security Coalition on Instagram (opens in a new tab)",
  },
  privacyTitle: "Privacy",
  privacy:
    "Text size, contrast, plain language, and language choice are saved only in this browser. The join form is emailed to the network and a confirmation is emailed to you. Do not include passwords or identity document numbers in your message.",
  contactTitle: "Inquiries",
  backToTop: "Back to top",
  sitemapLabel: "Sitemap",
  llmsLabel: "LLM info",
  rights: "European Youth Peace and Security Network (EYPS Network).",
  madeBy: "Website by",
  madeByName: "Obada Altarazi",
  madeBySite: "cupcoding.com",
  announced: {
    lang: "Language set to English.",
    contrastOn: "High contrast on.",
    contrastOff: "High contrast off.",
    plainOn: "Plain language on.",
    plainOff: "Plain language off.",
    smaller: "Text size decreased.",
    larger: "Text size increased.",
    limit: "Text size is already at the limit.",
    menuOpen: "Menu opened.",
    menuClose: "Menu closed.",
    a11yOpen: "Accessibility options opened.",
    a11yClose: "Accessibility options closed.",
    resources: "{n} resources shown.",
  },
  pillars: [
    {
      id: "participation",
      title: "Participation",
      lede: "Young peacebuilders in the decisions, not only the opening session.",
      body: "Members prepare each other for local councils, regional forums, and international meetings. The point is to stay in the process after the communiqué: drafting language, following budgets, and asking what changed.",
      plain:
        "Young people should help make decisions about peace, not only attend a photo. Members practice speaking with evidence and following up after meetings.",
      points: [
        "Brief members before political, diplomatic, and policy meetings.",
        "Share what was said, and what was refused, with the people back home.",
        "Track whether youth language in a text became a budget line.",
      ],
    },
    {
      id: "protection",
      title: "Protection",
      lede: "Keep young peacebuilders, climate defenders, and rights advocates safe enough to continue.",
      body: "Shrinking civic space and direct threats are part of the work, not an edge case. Protection here means practical habits: knowing the risk before travel, agreeing how the group will respond, and treating digital abuse as violence.",
      plain:
        "Some young peacebuilders are threatened for their work. The network shares simple safety steps for travel, meetings, and the internet, and backs people who need to step back.",
      points: [
        "Check risks before a public meeting or a border crossing.",
        "Agree who to call if someone is detained, doxxed, or followed.",
        "Do not ask people to be brave instead of being prepared.",
      ],
    },
    {
      id: "prevention",
      title: "Prevention",
      lede: "Work on the reasons violence starts, while there is still time to change them.",
      body: "Prevention covers hate speech, recruitment into violent extremism, and conflict made worse by climate stress. Programmes are led by the community that has to live with the result, not flown in for a weekend.",
      plain:
        "Stop violence early. That includes hate speech, groups that pull young people into extremist violence, and fights made worse by climate stress. Local youth should lead.",
      points: [
        "Name the local grievance before offering a regional slogan.",
        "Separate argument, which is healthy, from dehumanising speech.",
        "Pair early warning with something the community can actually do.",
      ],
    },
    {
      id: "partnerships",
      title: "Partnerships",
      lede: "Link youth networks to institutions that already hold a mandate.",
      body: "Members sit with national civil society and with multilateral bodies — including European Union institutions and United Nations channels. United Nations YPS frameworks — which the European Union helps implement — are regular reference points for coordination, not logos for a slide.",
      plain:
        "Youth groups should not work alone. They connect with local organisations and with bigger bodies such as the European Union and the United Nations.",
      points: [
        "Ask what the institution can fund, protect, or publish — specifically.",
        "Keep youth organisations as authors, not as invited guests.",
        "Write the partnership down so it survives a staff change.",
      ],
    },
    {
      id: "reintegration",
      title: "Disengagement and reintegration",
      lede: "A way back into civic life for youth pulled toward armed conflict or radicalisation.",
      body: "Reintegration fails when it is only a slogan about second chances. Members work on practical return: a peer who is not a caseworker, a skill that is actually paid, and a community willing to let someone be ordinary again.",
      plain:
        "Some young people have been close to armed groups or violent ideas and want a way out. Help means work, friends who are not police, and a community that will let them start again.",
      points: [
        "Do not make a public story out of someone who needs privacy.",
        "Offer a role in community life, not only a counselling session.",
        "Watch for stigma inside the youth group itself.",
      ],
    },
  ],
  hubs: [
    {
      id: "west-africa",
      title: "West Africa",
      lede: "Regional coordination for members across West Africa.",
      body: "Regional Administrators facilitate communication among members, support network activities, and strengthen synergies between local, regional, and international initiatives grounded in West African realities.",
      plain:
        "In West Africa, regional coordinators help members talk to each other, run activities, and link local work to the wider network.",
      points: [
        "Promote justice, peace, human rights, and shared EU values.",
        "Encourage youth engagement in peace, security, and development.",
        "Share information, opportunities, and good practices.",
      ],
    },
    {
      id: "central-africa",
      title: "Central Africa",
      lede: "Regional coordination for members across Central Africa.",
      body: "This region connects young peacebuilders working in diverse and often fragile contexts. Administrators support participation in network initiatives, consultations, and cross-border cooperation.",
      plain:
        "In Central Africa, coordinators help young peacebuilders join network activities and work across borders.",
      points: [
        "Strengthen partnerships among youth, civil society, and institutions.",
        "Support members’ participation in consultations and activities.",
        "Carry regional priorities into the network’s international work.",
      ],
    },
    {
      id: "esa",
      title: "Eastern and Southern Africa",
      lede: "Regional coordination across Eastern and Southern Africa.",
      body: "Administrators strengthen connections among members, promote intercultural dialogue, and support implementation of the YPS Agenda across varied geographical, social, and political contexts in the region.",
      plain:
        "In Eastern and Southern Africa, coordinators link members, support dialogue, and help put the YPS Agenda into practice locally.",
      points: [
        "Facilitate exchange of opportunities and good practices.",
        "Support inclusive representation of regional perspectives.",
        "Link local initiatives to regional and international action.",
      ],
    },
    {
      id: "europe",
      title: "Europe",
      lede: "European members linking local work to the UN YPS Agenda.",
      body: "The Europe region connects European youth platforms to the global EYPS Network and to European Union conversations on implementing the United Nations Youth, Peace and Security Agenda. Inquiries for the wider network can start at the shared mailbox.",
      plain:
        "In Europe, members connect European youth groups with the global network and with EU talks on putting the UN Youth, Peace and Security Agenda into practice.",
      points: [
        "Bridge into UN Youth, Peace and Security frameworks and EU implementation.",
        "Link European members with hubs worldwide.",
        "Shared inquiries via euypsnet@gmail.com.",
      ],
    },
    {
      id: "lac",
      title: "Latin America and the Caribbean",
      lede: "Regional coordination across Latin America and the Caribbean.",
      body: "This region brings together young activists and organisations working for peace, inclusion, and sustainable development. Regional Coordinators strengthen cooperation among members and with the wider network.",
      plain:
        "In Latin America and the Caribbean, coordinators help young activists work together for peace, inclusion, and development.",
      points: [
        "Strengthen cross-border youth cooperation.",
        "Support members’ participation in network initiatives.",
        "Ensure regional priorities are heard internationally.",
      ],
    },
    {
      id: "asia-me",
      title: "Asia and the Middle East",
      lede: "Regional coordination across Asia and the Middle East.",
      body: "This region connects young activists across borders, fostering dialogue and cooperation on shared challenges. Regional Coordinators support educational opportunities, human rights advocacy, and safe spaces for networking.",
      plain:
        "In Asia and the Middle East, coordinators connect young activists across borders for dialogue, learning, and cooperation.",
      points: [
        "Connect activists across borders on shared challenges.",
        "Support dialogue, education, and networking spaces.",
        "Link local priorities to the global EYPS Network.",
      ],
    },
  ],
  resources: [
    {
      id: "esa-webinar-concept-note",
      kind: "brief",
      title: "ESA Regional Webinar — Concept Note",
      summary:
        "Concept note for the East & Southern Africa hub webinar on misinformation, disinformation and malinformation (16 October 2026).",
      body: "Virtual EU YPS Network webinar for the East and Southern Africa region on information integrity, using Kenya as the main case study with brief comparisons from the wider region.\n\nDate: Thursday, 16 October 2026, 6:00–8:00 PM EAT. Download the PDF for aims, methodology, speaker details and expected outcomes.\n\nContact euypsnet@gmail.com if you need an accessible format.",
      fileHref: "/documents/ESA_Regional_Webinar_Concept_Note_16_Oct_2026.pdf",
    },
    {
      id: "esa-webinar-program",
      kind: "brief",
      title: "ESA Regional Webinar — Draft Programme",
      summary:
        "Draft session programme for the East & Southern Africa regional webinar on information integrity (16 October 2026).",
      body: "Two-hour draft programme covering definitions of information disorder, how content is manipulated, election and protest framing in East Africa, a live verification exercise, and an AmaniCheck demonstration.\n\nDate: Thursday, 16 October 2026. Download the PDF for the timed segments.\n\nShare with organisers and participants before the session. Contact euypsnet@gmail.com if you need an accessible format.",
      fileHref: "/documents/ESA_Regional_Webinar_Program_16_Oct_2026.pdf",
    },
    {
      id: "together-for-peace-agenda",
      kind: "brief",
      title: "Together for Peace — Agenda",
      summary: "Updated programme agenda for Together for Peace (PDF).",
      body: "This is the updated Together for Peace agenda. Download the PDF for the full schedule and session details.\n\nShare it with organisers and participants before the event. Contact euypsnet@gmail.com if you need an accessible format.",
      fileHref: "/documents/Together_for_Peace_Agenda_updated.pdf",
    },
    {
      id: "unscr-primer",
      kind: "brief",
      title: "What 2250, 2419, and 2535 actually ask",
      summary: "A short reading of the three Security Council resolutions in everyday language.",
      body: "Resolution 2250 (2015) asks states to include young people in preventing violence and building peace. It is organised around participation, protection, prevention, partnerships, and disengagement and reintegration.\n\nResolution 2419 (2018) says youth should be part of negotiating and implementing peace agreements, not only community projects beside the formal process.\n\nResolution 2535 (2020) pushes the UN system to track protection and participation, and to be honest about gaps.\n\nUse this brief to prepare a meeting. It is not a legal opinion and it does not replace the resolutions themselves.",
    },
    {
      id: "cps-note",
      kind: "brief",
      title: "Climate, peace and security in youth work",
      summary: "How displacement and disaster risk show up in youth peace work.",
      body: "In many regions, a storm is also a political event. Land, water, shelter, and aid become contested. Youth peace work that ignores this will talk about dialogue while people are already moving.\n\nAsk three questions in any climate project:\n1. Who loses a place to live, and who decides where they go?\n2. Which existing tension gets worse when resources shrink?\n3. Are young women and youth with disabilities in the assessment, or only in the photo?\n\nPair early warning with a local action people can take without a new grant.",
    },
    {
      id: "digital-toolkit",
      kind: "toolkit",
      title: "Digital peacebuilding and cyber safety",
      summary: "Habits for organising online when hate speech and cost both shut people out.",
      body: "Before a campaign, agree what must never be posted: home addresses, travel plans, photos of identity documents, and private disagreements.\n\nUse a shared checklist:\n- Who can lock the account if a phone is taken?\n- Is there a low-bandwidth way to join, such as audio only or a written summary?\n- How will the group answer a lie about it without amplifying the lie?\n- What does the group do when abuse is gendered or aimed at disabled members?\n\nDigital access is part of participation. A tool that only works on a new phone is a closed door.",
    },
    {
      id: "inclusion-toolkit",
      kind: "toolkit",
      title: "Including youth with disabilities",
      summary: "Plan access before invitations, and budget it like any other room cost.",
      body: "Ask people what they need. Do not guess, and do not wait until the week of the event.\n\nMinimum checks:\n- Step-free route from the street to the seat, the toilet, and the exit.\n- Documents that work with a screen reader, sent in advance.\n- Captions or sign language when speech is the main way information moves.\n- Breaks, quiet space, and time that does not punish people who need longer.\n- Facilitators who do not talk over someone using an interpreter or a communication aid.\n\nPay for access the way you pay for the venue. If there is no budget line, the event is not ready.",
    },
    {
      id: "five-pillars-training",
      kind: "training",
      title: "Facilitating a five-pillar session",
      summary: "A 90-minute outline for members meeting for the first time.",
      body: "Goal: each person can point to one pillar their group already practices, and one they avoid.\n\n0–10 min. Names, access needs, and what people want from the hour.\n10–25 min. Read the five pillar names out loud. Ask which word is unclear.\n25–60 min. In pairs, pick one real activity and place it under a pillar. If it fits two, say why.\n60–80 min. Share one gap the group is willing to work on in the next month.\n80–90 min. Agree who writes the note, and who must not be named in public.\n\nStop if the room is not safe enough for honest examples. Safety outranks the agenda.",
    },
    {
      id: "reintegration-note",
      kind: "training",
      title: "Disengagement and reintegration, carefully",
      summary: "Practice notes for supporting a return to ordinary civic life.",
      body: "Do not promise a programme you cannot protect. Reintegration work can expose the person and the facilitator.\n\nPrinciples:\n- Privacy first. No success story without ongoing, informed consent.\n- A paid role or a real skill beats a one-off workshop.\n- The youth group must deal with its own fear and stigma, or it will recreate exclusion.\n- Know the referral you will use if someone is in immediate danger, and know its limits.\n\nIf your group has no local partner for this pillar, say so. Pretending is more dangerous than a gap.",
    },
    {
      id: "partnerships-brief",
      kind: "brief",
      title: "Partnerships with EU youth policy and Search for Common Ground",
      summary: "How to show up as an author when larger institutions open a door.",
      body: "A partnership is useful when it changes protection, money, or policy text. A logo exchange is not a partnership.\n\nWhen engaging European Union youth policy frameworks or Search for Common Ground processes, prepare:\n- The decision you want influenced, in one sentence.\n- Evidence from members, with permission to share it.\n- The access needs of anyone you put forward to speak.\n- What you will not trade away, such as naming a community that asked not to be named.\n\nLeave with a written next step and a name. Report back to members in plain language.",
    },
    {
      id: "protection-basics",
      kind: "toolkit",
      title: "Protection basics before you travel or publish",
      summary: "A short checklist for young peacebuilders heading into a public role.",
      body: "Before travel:\n- Tell two people your plan and when you should check in.\n- Carry what you need if a phone is taken. Do not carry what would hurt other people if it is taken.\n- Know which meetings are public and which are closed.\n\nBefore you publish:\n- Remove locations, faces of people who did not agree, and documents.\n- Assume a hostile reader. Insults are not the same as a plan to harm, but do not ignore a plan.\n- Agree who speaks to media so the rest of the group is not surprised.\n\nAfter an incident, care for the person first. The statement can wait.",
    },
  ],
};

const ar: Copy = {
  skip: "تخطي إلى المحتوى الرئيسي",
  accessibility: "خيارات إمكانية الوصول",
  openAccessibility: "فتح خيارات إمكانية الوصول",
  closeAccessibility: "إغلاق خيارات إمكانية الوصول",
  textSize: "حجم النص",
  smaller: "تصغير النص",
  larger: "تكبير النص",
  contrast: "تباين عالٍ",
  contrastShort: "تباين",
  contrastOn: "التباين العالي مفعّل",
  plain: "لغة مبسطة",
  plainShort: "مبسّط",
  plainOn: "اللغة المبسطة مفعّلة",
  language: "اللغة",
  tagline: "شبكة الشباب والسلام والأمن",
  switchLangLabel: "Read this page in English",
  switchLangShort: "EN",
  openMenu: "فتح القائمة",
  closeMenu: "إغلاق القائمة",
  primaryNav: "التنقل الرئيسي",
  mobileNav: "قائمة الجوال",
  nav: [
    { href: "/pillars", label: "الركائز" },
    { href: "/regions", label: "الأقاليم" },
    { href: "/team", label: "تعرّف على الفريق" },
    { href: "/activities", label: "الأنشطة" },
    { href: "/resources", label: "الموارد" },
    { href: "/join", label: "انضم" },
  ],
  joinCta: "انضم إلى الشبكة",
  exploreCta: "استكشف الركائز الخمس",
  kicker: "شبكة الاتحاد الأوروبي للشباب والسلام والأمن",
  title: "الشباب في طليعة السلام والأمن عبر أقاليم العالم",
  sub: "تمكين الشباب لبناء مجتمعات شاملة وسلمية ومرنة بما يتسق مع أجندة الأمم المتحدة للشباب والسلام والأمن.",
  plainSub:
    "تساعد هذه الشبكة الشباب على بناء مجتمعات سلمية وعادلة. العمل يتبع أجندة الأمم المتحدة للشباب والسلام والأمن.",
  photoCaption: "تنسيق بين الأعضاء",
  photoDetail: "بناة سلام شباب يقارنون الملاحظات بين الأقاليم.",
  photoAlt:
    "شباب من عدة أقاليم يجلسون حول طاولة خشبية في قاعة مضاءة بنور النهار، ويراجعون خرائط ورقية ودفاتر.",
  metrics: [
    { value: "50+", label: "منظمة عضو" },
    { value: "20+", label: "دولة" },
    { value: "15+", label: "فعالية" },
    { value: "1000+", label: "شاب وشابة تم الوصول إليهم" },
  ],
  aboutTitle: "من نحن",
  about:
    "الشبكة الأوروبية للشباب والسلام والأمن (شبكة EYPS) شبكة دولية من الناشطين الشباب والمناصرين والباحثين وصانعي التغيير، حاضرة في أكثر من 82 بلدًا حول العالم. تأسست على مبادئ أجندة الأمم المتحدة للشباب والسلام والأمن وقيمها — التي يساعد الاتحاد الأوروبي على تنفيذها — وتعمل كمنصة عالمية للحوار والتعاون والعمل الجماعي، لتمكين الشباب من الإسهام في تعزيز السلام والأمن الإنساني والتماسك الاجتماعي والتنمية المستدامة. رؤيتنا عالم يستطيع فيه كل شاب وشابة المساهمة في بناء مجتمعات سلمية وشاملة ومرنة. مهمتنا تعبئة الشباب وربطهم وتمكينهم ليشاركوا مشاركة هادفة في عمليات السلام والأمن والتنمية المستدامة.",
  aboutPlain:
    "تجمع الشبكة الأوروبية للشباب والسلام والأمن ناشطين ومناصرين وباحثين وصانعي تغيير شباب في أكثر من 82 بلدًا. تتبع أجندة الأمم المتحدة للشباب والسلام والأمن، التي يساعد الاتحاد الأوروبي على تنفيذها. نريد لكل شاب وشابة أن يساعد في بناء مجتمعات سلمية، ونعمل على ربط الشباب وتمكينهم حتى تُسمع أصواتهم في قرارات السلام والأمن.",
  resolutions: [
    { code: "2250", year: "2015", text: "يعترف بالشباب شركاء في منع النزاع وبناء السلام." },
    { code: "2419", year: "2018", text: "يدعو إلى مشاركة الشباب عند التفاوض على اتفاقات السلام وتنفيذها." },
    { code: "2535", year: "2020", text: "يطلب من منظومة الأمم المتحدة الإبلاغ عن الحماية والمشاركة وما لم يُنجز بعد." },
  ],
  partnersLabel: "بالتعاون مع",
  partners: "أجندة الأمم المتحدة للشباب والسلام والأمن · المنظمات الأعضاء",
  pillarsTitle: "الركائز الخمس",
  pillarsIntro: "أجندة الشباب والسلام والأمن منظّمة حول خمسة التزامات. افتح ركيزة لتقرأ ما تطلبه من الشبكة في الممارسة.",
  pillarsHint: "ألسنة عمودية. استخدم سهمي الأعلى والأسفل للتنقل. Enter أو المسافة للتحديد أيضًا.",
  showing: "تقرأ الآن",
  hubsTitle: "أقاليمنا",
  hubsIntro:
    "شبكة EYPS حاضرة في أكثر من 82 بلدًا. لضمان تمثيل شامل وتنسيق فعّال وفهم أفضل للواقع المحلي، تعتمد الشبكة هيكلًا إقليميًا ديناميكيًا ينسّقه المسؤولون الإقليميون.",
  hubsHint: "ألسنة أفقية. استخدم سهمي اليمين واليسار للتنقل.",
  upcomingTitle: "الأنشطة القادمة",
  upcomingIntro:
    "برامج ومذكرات مفاهيمية لفعاليات الشبكة القادمة. نزّلوا ملفات PDF للتحضير أو للمشاركة مع الأعضاء.",
  upcoming: [
    {
      id: "esa-webinar-2026",
      title: "ندوة شرق وجنوب أفريقيا الإقليمية",
      when: "الخميس 16 تشرين الأول/أكتوبر 2026 · 6:00–8:00 مساءً بتوقيت شرق أفريقيا",
      where: "افتراضي · مركز شرق وجنوب أفريقيا",
      summary:
        "جلسة عملية لشبكة الاتحاد الأوروبي للشباب والسلام والأمن حول المعلومات المضلّلة والمغلوطة والخبيثة، مع كينيا كدراسة حالة رئيسية ومقارنات قصيرة من الإقليم — وتشمل تمرين تحقق مباشر وعرض أداة AmaniCheck.",
      documents: [
        {
          label: "المذكرة المفاهيمية (PDF)",
          href: "/documents/ESA_Regional_Webinar_Concept_Note_16_Oct_2026.pdf",
        },
        {
          label: "مسودة البرنامج (PDF)",
          href: "/documents/ESA_Regional_Webinar_Program_16_Oct_2026.pdf",
        },
      ],
    },
  ],
  focusTitle: "ما نعمل عليه",
  focusIntro:
    "من خلال المبادرات والشراكات وفضاءات التبادل، نعزّز المشاركة الهادفة للشباب في صنع القرار محليًا وإقليميًا ودوليًا.",
  focus: [
    {
      title: "تعزيز الحوار",
      text: "نشجّع المشاركة الهادفة للشباب في السياسات وصنع القرار، ونوفّر فضاءات يشارك فيها الشباب تجاربهم ويطوّرون الحلول ويُسمع صوتهم.",
      plain: "نساعد الشباب على المشاركة في نقاشات السياسات والقرارات ومشاركة الأفكار وأن يُسمعوا.",
      image: "/images/climate.webp",
      alt: "شباب يقفون على شاطئ رملي عصراً، ينظرون نحو أشجار المنغروف وسحب منخفضة. بعضهم يحمل دفاتر.",
      caption: "حوار يربط الأصوات المحلية بصنع القرار الأوسع.",
    },
    {
      title: "تعزيز الإدماج",
      text: "نعمل من أجل تمثيل متنوع وفرص متكافئة حتى يتمكن الشباب من خلفيات وثقافات وتجارب مختلفة من المشاركة الكاملة في عمليات السلام والأمن.",
      plain: "نحرص على حضور أنواع كثيرة من الشباب ومعاملتهم بعدل في عمل السلام والأمن.",
      image: "/images/inclusion.webp",
      alt: "شابة تستخدم كرسيًا متحركًا تتحدث حول طاولة مستديرة بينما يستمع شباب آخرون، والدفاتر مفتوحة، في غرفة اجتماع مضيئة.",
      caption: "الإدماج يُخطَّط داخل كل عملية، لا عند الباب.",
    },
    {
      title: "بناء القدرات والشبكات",
      text: "نوفّر التدريب والموارد لبناة السلام والقادة الشباب، ونربط الشباب والمنظمات عبر الحدود حتى يكون للتعاون والعمل الجماعي أثر أكبر.",
      plain: "نوفّر تدريبًا وأدوات، ونربط الشباب والمنظمات عبر الحدود.",
      image: "/images/digital.webp",
      alt: "شخصان شابان يجلسان في غرفة إعلام مجتمعية متواضعة ويتابعان حاسوباً محمولاً معًا. أحدهما يضع سماعات.",
      caption: "مهارات وفرص وروابط عبر الحدود.",
    },
  ],
  resourcesTitle: "موجزات وأدوات",
  resourcesIntro: "نصوص قصيرة يمكن تنزيلها أو طباعتها. هي نقاط بداية بلغة واضحة للأعضاء، وليست وثائق رسمية للأمم المتحدة.",
  filters: [
    { id: "all", label: "الكل" },
    { id: "brief", label: "موجزات سياسات" },
    { id: "toolkit", label: "أدوات" },
    { id: "training", label: "مذكرات تدريب" },
  ],
  filterLabel: "تصفية الموارد",
  resultCount: "يُعرض {n} من الموارد",
  emptyResources: "لا شيء في هذه المجموعة بعد.",
  download: "تنزيل نص",
  downloadFile: "تنزيل PDF",
  printPdf: "طباعة أو حفظ كملف PDF",
  downloading: "جارٍ التنزيل…",
  downloaded: "تم التنزيل",
  kindLabel: {
    brief: "موجز سياسات",
    toolkit: "أداة",
    training: "مذكرة تدريب",
  },
  teamTitle: "المسؤولون الإقليميون",
  teamIntro:
    "تعرّف على من ينسّقون الشبكة الأوروبية للشباب والسلام والأمن — التنسيق العام، والمسؤولون الإقليميون، والتواصل.",
  teamReadMore: "اقرأ المزيد",
  teamClose: "إغلاق السيرة",
  teamDialogLabel: "سيرة عضو الفريق",
  team: [
    {
      id: "rok-kozelj",
      name: "روك كوجلي",
      role: "عضو في مكتب التنسيق العام",
      image: teamImage("rok-kozelj"),
      alt: "صورة روك كوجلي",
      bio: "وُلد عام 1976، سلوفيني وإيطالي. درس العلوم السياسية في تورينو ويعمل في مؤسسات الاتحاد الأوروبي منذ 2006:\n\nالبرلمان الأوروبي (2006 – 2021): مسؤول عن عدة وفود برلمانية للعلاقات مع دول ثالثة: العراق والمغرب العربي والمشرق وجنوب أفريقيا والجمعية البرلمانية للاتحاد من أجل المتوسط والجمعية البرلمانية المشتركة لأفريقيا والكاريبي والمحيط الهادئ، حيث تولّى لجنتها الاجتماعية والبيئية ومنتديات الشباب فيها.\n\nدائرة العمل الخارجي الأوروبي (2021 – حتى اليوم): مسؤول عن القمم والاجتماعات الوزارية بين الاتحاد الأوروبي والاتحاد الأفريقي، ولاحقًا عن الهشاشة وسياسة العناية الواجبة بحقوق الإنسان ورابطة العمل الإنساني والتنمية والسلام وأجندة الشباب والسلام والأمن.\n\nساهم في تأسيس المجموعة الأساسية لشباب أفريقيا وأوروبا عام 2022. أسّس شبكة الاتحاد الأوروبي للشباب والسلام والأمن عام 2025.\n\nاللغات: السلوفينية والإيطالية والإنجليزية والفرنسية.\n\nشخصيًا: متزوج وله أربعة أطفال. هواياته البرمجة والجبال.",
    },
    {
      id: "bouraima-kabore",
      name: "بورايما كابوريه",
      role: "مسؤول إقليمي – غرب أفريقيا",
      image: teamImage("bouraima-kabore"),
      alt: "صورة بورايما كابوريه",
      bio: "بورايما كابوريه خبير في إدارة المشاريع ومستشار تنمية أعمال ومدافع عن السلام والأمن والتماسك الاجتماعي في بوركينا فاسو. حاصل على بكالوريوس في الإدارة وإدارة المشاريع ويكمل حاليًا درجة الماجستير (Master II)، إلى جانب شهادات مهنية في الاستشارة التجارية والرصد والتقييم والاستشارة الدولية.\n\nبأكثر من عشرين عامًا من الانخراط المجتمعي، ساهم في منع النزاع ومشاركة الشباب في بناء السلام والترويج لقرار مجلس الأمن 2250 بشأن الشباب والسلام والأمن. وهو مؤسس ورئيس جمعية الشباب لتعزيز السلام والمصالحة في منطقة الوسط الغربي، ونقطة الاتصال لأجندة الشباب والسلام والأمن لدى يونواس.\n\nكمسؤول إقليمي لغرب أفريقيا، يلتزم بتعزيز الشراكات بين الأقاليم وترقية قيادة الشباب وتنفيذ أجندة الشباب والسلام والأمن محليًا ووطنيًا وإقليميًا ودوليًا.",
    },
    {
      id: "bertin-cituli",
      name: "بيرتين سيتولي",
      role: "مسؤول إقليمي – وسط أفريقيا",
      image: teamImage("bertin-cituli"),
      alt: "صورة بيرتين سيتولي",
      bio: "البلد: جمهورية الكونغو الديمقراطية. المناصب الحالية: نائب المنسق الوطني لمنظمة نساء من أجل فرص متساوية – الكونغو؛ مدرّس إنجليزية؛ مسؤول إقليمي لشبكة الاتحاد الأوروبي للشباب والسلام والأمن / وسط أفريقيا (تطوعًا)؛ مدير برنامج المجموعة الأساسية لشباب أفريقيا وأوروبا (تطوعًا)؛ ممثل قطري لـ Youth4Youth Africa (تطوعًا).\n\nبيرتين سيتولي بانٍ شاب للسلام ومتخصص في البيئة ونسوي ومربٍ من جمهورية الكونغو الديمقراطية. حاصل على بكالوريوس (+5 سنوات) في الإنجليزية والثقافة الأفريقية وخريج برنامج McKinsey Forward (الولايات المتحدة).\n\nبصفته نائب المنسق الوطني ومدير برنامج وممثلًا قطريًا، يعزّز مشاركة الشباب وحقوق الإنسان والسلام المستدام. وكمسؤول إقليمي لوسط أفريقيا، يلتزم بدفع أجندة الشباب والسلام والأمن عبر قيادة شاملة وتعاون إقليمي ومشاركة شبابية هادفة في أفريقيا وأوروبا وخارجهما.",
    },
    {
      id: "fatuma-adokorach",
      name: "فاتوما أدوكوراتش",
      role: "مسؤولة إقليمية – شرق أفريقيا والجنوب الأفريقي",
      image: teamImage("fatuma-adokorach"),
      alt: "صورة فاتوما أدوكوراتش",
      bio: "فاتوما أدوكوراتش قائدة شبابية أوغندية وبانية سلام ومدافعة مجتمعية ملتزمة بالسلام الشامل والعدالة والمرونة في المجتمعات المتأثرة بالنزاع (غولو، شمال أوغندا). تدرس درجة البكالوريوس في العلاقات الدولية ودراسات الأمن في جامعة غولو، وتركّز أبحاثها على التكامل الإقليمي كمسار للسلام والأمن في شرق أفريقيا.\n\nيتمحور عملها حول تمكين الشباب وبناء السلام وحقوق الإنسان والتنمية المجتمعية. ساهمت في مبادرات يقودها الشباب مثل شبكة مناصرة الشباب وروكو باكو، لتعزيز المشاركة المدنية والمشاركة الهادفة في عمليات السلام.\n\nتعمل حاليًا مسؤولة إقليمية لشرق أفريقيا والجنوب الأفريقي ضمن الشبكة الأوروبية للشباب والسلام والأمن، وتدعم التنسيق والمشاركة عبر الإقليم. تدفعها الرغبة في تعزيز أصوات الشباب وتعزيز التعاون ودفع أجندة الشباب والسلام والأمن عبر مقاربات شاملة ومستدامة.",
    },
    {
      id: "gebreegziabher-tadele-desalegn",
      name: "غيبريغزيابهير تاديلي ديساليغن",
      role: "مسؤول إقليمي – شرق أفريقيا والجنوب الأفريقي",
      image: teamImage("gebreegziabher-tadele-desalegn"),
      alt: "صورة غيبريغزيابهير تاديلي ديساليغن",
      bio: "غيبريغزيابهير تاديلي ديساليغن صحفي وسفير سلام عالمي من تيغراي، إثيوبيا، بخبرة تمتد إلى 13 عامًا. حصل على شهادات من منافذ إعلامية ومؤسسات دولية منها أكاديمية CNN وAFP ورويترز وأكاديمية NBCU وجامعة ديربي (المملكة المتحدة) وجامعة إنديانا (الولايات المتحدة) وجامعة الأمم المتحدة وشراكة أكاديمية الاتحاد الأوروبي الدولية.\n\nوهو أيضًا سفير سلام عالمي معتمد من معهد الاقتصاد والسلام وGlobal Peace Chain، وسفير لدى United Leaders Global ومؤسسة My Body is My Body، وعضو مجلس إدارة International Cities of Peace.\n\nيعمل حاليًا مسؤولًا إقليميًا لشرق أفريقيا والجنوب الأفريقي ضمن الشبكة الأوروبية للشباب والسلام والأمن، ويتعاون مع منظمات دولية بصفة تطوعية.",
    },
    {
      id: "kasim-ahmed",
      name: "قاسم أحمد",
      role: "مسؤول إقليمي – شرق أفريقيا والجنوب الأفريقي",
      image: teamImage("kasim-ahmed"),
      alt: "صورة قاسم أحمد",
      bio: "قاسم أحمد مهني تنموي من الصومال ملتزم بتمكين الشباب والتنمية المجتمعية وبناء السلام والأثر الاجتماعي المستدام. لديه خبرة عملية في إدارة المشاريع والقيادة وإشراك أصحاب المصلحة والخدمات الاستشارية في قطاع التنمية.\n\nسبق أن عمل مدير مشاريع في SYDPA، وينسّق حاليًا كمستشار لمنظمات غير حكومية مع European East Africa Advisors.\n\nيتابع تعليمه العالي في الجامعة الوطنية الصومالية، كلية الطب البيطري وتربية الحيوان، بما يكمل اهتمامه بمرونة المجتمعات وسبل العيش المستدامة.\n\nاللغات: الصومالية والإنجليزية والعربية.",
    },
    {
      id: "ema-mecaj",
      name: "إيما متشاج",
      role: "مسؤولة إقليمية – أوروبا",
      image: teamImage("ema-mecaj"),
      alt: "صورة إيما متشاج",
      bio: "إيما متشاج ناشطة شبابية ألبانية وطالبة طب ذات خبرة واسعة في حقوق الإنسان، تدافع عن حقوق الأطفال والمساواة بين الجنسين وبناء السلام والإدماج الاجتماعي. يوضح انخراطها مع الأمم المتحدة ومنظمة الأمن والتعاون في أوروبا التزامها بهذه القضايا ومساهمتها في صياغة السياسات الإقليمية.\n\nتمتد مناصرتها من التنظيم القاعدي إلى الدبلوماسية والتأثير في السياسات. تعمل حاليًا مندوبة شباب الأمم المتحدة لألبانيا، وسبق أن مثّلت منطقة اللجنة الاقتصادية لأوروبا في لجنة وضع المرأة في نيويورك. وهي عضو نشط في المجموعة الاستشارية لشباب الأمم المتحدة في ألبانيا وزميلة في برنامج شباب الأمم المتحدة للإدماج والمساواة والثقة.\n\nمنذ 2025 تعمل في برنامج WeBalkans التابع للمفوضية الأوروبية. تهدف إلى تعزيز المساواة والتضامن والعدالة الاجتماعية وإيصال صوت شباب ألبانيا والبلقان الغربي إلى المنصات الإقليمية والعالمية.",
    },
    {
      id: "carol-zakhour",
      name: "كارول زخور",
      role: "مسؤولة إقليمية – أوروبا وآسيا والشرق الأوسط",
      image: teamImage("carol-zakhour"),
      alt: "صورة كارول زخور",
      bio: "كارول زخور ناشطة سورية في حقوق المرأة وبانية سلام ورائدة اجتماعية. وهي مؤسسة والرئيسة التنفيذية لمبادرة Uplifting Syrian Women التي أُطلقت عام 2021 لتمكين النساء في سوريا عبر ردم فجوات النوع الاجتماعي في التعليم والتوظيف والقيادة من خلال دورات مجانية عبر الإنترنت وورش عمل ومجموعات دعم وموارد. حظي عملها مع المبادرة بجائزة Women in Tech لأكثر المبادرات أثرًا في منطقة الشرق الأوسط وشمال أفريقيا، وتعمل مسؤولة في شبكة الشباب والسلام والأمن التابعة لدائرة العمل الخارجي الأوروبي وعضوًا في مجلس الشباب المتوسطي. أكاديميًا، تحمل بكالوريوس الآداب في الأدب الإنجليزي والإعلام الجماهيري، ودرست دبلومًا في الابتكار الاجتماعي في جامعة السلام، وتتابع حاليًا ماجستير الدراسات الأوروبية مع تركيز خاص على شؤون الاتحاد الأوروبي في جامعة لوفان الكاثوليكية (UCLouvain).",
    },
    {
      id: "patricia-z-gaye",
      name: "باتريشيا زي. غاي",
      role: "منسقة إقليمية – غرب أفريقيا",
      image: teamImage("patricia-z-gaye"),
      alt: "صورة باتريشيا زي. غاي",
      bio: "البلد: ليبيريا. الإقليم: غرب أفريقيا. موقعها الحالي: منسقة (الشباب والسلام والأمن)؛ الرئيسة التنفيذية لمزرعة تايلر؛ طالبة طب؛ نائبة رئيس ROAJELF ليبيريا؛ الرئيسة المشاركة لشبكة القيادة النسائية الأفريقية (AWLN) – تجمع الشباب.\n\nباتريشيا زي. غاي مدافعة شغوفة عن قيادة المرأة والشباب وتمكينهما والسلام في ليبيريا. تعمل حاليًا منسقة لمجتمع الاتحاد الأوروبي المعني بالشباب والسلام والأمن في غرب أفريقيا، والرئيسة التنفيذية لمزرعة تايلر، وطالبة طب. تكرّس جهودها لمعالجة نقص تمثيل النساء والشباب في أدوار صنع القرار.\n\nيتجلى التزامها ببناء قدرات القيادة لدى النساء والفتيات من خلال عملها مدرّبة في برنامج القيادة السياسية التابع لهيئة الأمم المتحدة للمرأة، حيث درّبت هي وفريقها أكثر من 210 مرشحات عبر 15 مقاطعة في ليبيريا. وتشرف على عيادة قيادة المرأة، التي مكّنت أكثر من 500 امرأة من تولي مواقع قيادية منذ إطلاقها عام 2020 أثناء عملها مديرة برامج في Sister Aid Liberia. وتشغل بعض هؤلاء النساء اليوم مناصب عليا في الحكومة والمنظمات غير الحكومية في ليبيريا.\n\nإضافة إلى ذلك، ومن خلال دورها نائبة رئيس ROAJELF ليبيريا والرئيسة المشاركة لتجمع الشباب في شبكة القيادة النسائية الأفريقية، تلتزم بإلهام الجيل القادم من القائدات.\n\nتحمل درجة البكالوريوس في الأحياء والكيمياء من جامعة ليبيريا، وتتابع دراستها الطبية في كلية أ. م. دوغليوتي للطب، إلى جانب دبلومات متقدمة في القيادة والإدارة وشهادات متنوعة في القيادة العالمية وإدارة المشاريع والمشاركة السياسية للمرأة.",
    },
    {
      id: "amani-habimana-jospin",
      name: "أماني هابيمانا جوسبين",
      role: "منسق إقليمي – وسط أفريقيا",
      image: teamImage("amani-habimana-jospin"),
      alt: "صورة أماني هابيمانا جوسبين",
      bio: "أماني هابيمانا جوسبين ممارس في بناء السلام وحقوق الإنسان من منطقة البحيرات الكبرى، بخبرة في السياقات الهشة والمتأثرة بالنزاع في وسط أفريقيا. يعمل منسقًا إقليميًا لشبكة الاتحاد الأوروبي للشباب والسلام والأمن لوسط أفريقيا وزميل سلام شبابي ضمن برنامج إنتربيس للبحيرات الكبرى. وهو أيضًا الرئيس التنفيذي لـ SELP asbl في جمهورية الكونغو الديمقراطية ومسؤول الرصد والتقييم في الشراكة الوطنية للأطفال والشباب في بناء السلام.\n\nيركّز عمله على مشاركة الشباب وحقوق الإنسان والتماسك الاجتماعي وتوطين أجندتي الشباب والسلام والأمن (القرار 2250) والنساء والسلام والأمن (القرار 1325). قاد ودعم مبادرات في تحليل النزاع والحوار بين الأجيال والمناصرة السياسية وبناء السلام المجتمعي عبر وسط أفريقيا.",
    },
    {
      id: "yvette-ariwo",
      name: "إيفيت أريوو",
      role: "منسقة إقليمية – شرق أفريقيا والجنوب الأفريقي",
      image: teamImage("yvette-ariwo"),
      alt: "صورة إيفيت أريوو",
      bio: "تفاصيل السيرة قريبًا.",
    },
    {
      id: "hamisi-mwatondo",
      name: "حميسي مواتوندو",
      role: "منسق إقليمي – شرق أفريقيا والجنوب الأفريقي",
      image: teamImage("hamisi-mwatondo"),
      alt: "صورة حميسي مواتوندو",
      bio: "حميسي مواتوندو ممارس في السلام والأمن ومتخصص في الرصد والتقييم يعمل على نزاهة المعلومات على الساحل الكيني. يتابع حاليًا ماجستير في الاتصال والإعلام، بناءً على بكالوريوس في العلاقات الدولية والدبلوماسية مع تقنية المعلومات.\n\nوهو مؤسس ومنشئ منصة أماني تشيك (Amani Check)، منصة مدنية ثنائية اللغة (الإنجليزية والكيسواحيلية) للتحقق من الحقائق وبناء المرونة أمام المعلومات المضللة والتعليم في مجال منع التطرف العنيف والمجتمعي، وهي الآن في مرحلة تجريبية قبيل الدورة الانتخابية في كينيا عام 2027. قدّم المنصة في المؤتمر العابر للتخصصات بجامعة بواني، وتواصل مع مؤسسات منها اللجنة الوطنية للتماسك والاندماج (NCIC) والهيئة الحكومية للتنمية (IGAD) حول كيفية تصدي المجتمعات للمعلومات المضللة والمغلوطة والخبيثة باللغات والسياقات المحلية.\n\nيعمل حميسي مدير برامج في مركز جامي أكشن في مقاطعة كوالي، حيث يقود فريقًا من ثمانية أشخاص حول مشاركة الشباب والنساء والأطفال في صنع القرار. وهو أيضًا مسؤول الرصد والتقييم ومسؤول البرامج في تحالف الشباب المسلمين في كينيا (KMYA)، حيث يغطي عمله نزاهة المعلومات ومنع التطرف العنيف والمجتمعي والمشاركة المدنية عبر كينيا. يستند نهجه القائم على الأدلة إلى ممارسة بناء السلام وتدريب علوم البيانات من ALX Africa والعمل القاعدي مع الشباب والمجتمعات الإيمانية. اختير ضمن أفضل 30 تحت سن الثلاثين في مؤتمر الابتكار المناخي في كينيا (2026) ونال جائزة صناع التغيير الشباب (2025).",
    },
    {
      id: "yairy-vega-muenala",
      name: "يايري فيغا موينالا",
      role: "منسقة إقليمية – أمريكا اللاتينية والكاريبي",
      image: teamImage("yairy-vega-muenala"),
      alt: "صورة يايري فيغا موينالا",
      bio: "يايري فيغا موينالا مدافعة كيشوا أصلية من الإكوادور، امتد عملها من القيادة المجتمعية إلى الانخراط الإقليمي والدولي في قضايا السلام والأمن والحوكمة الشاملة. يتشكّل منظورها من فهم مجتمعي للسلام بوصفه أمرًا يستدام عبر الثقة والمشاركة والمعاملة بالمثل والمسؤولية الجماعية. دفعها ذلك إلى تعزيز دور النساء الأصليات والشباب في صياغة القرارات التي تمس مجتمعاتهم.\n\nتعمل اليوم عبر فضاءات إكوادورية وإقليمية وأوروبية. بصفتها محللة تعاون دولي في وزارة الخارجية والتنقل البشري في الإكوادور، تتعامل مع التعاون الإقليمي والإيبيرو-أمريكي. وبصفتها منسقة إقليمية لأمريكا اللاتينية والكاريبي ضمن شبكة الاتحاد الأوروبي للشباب والسلام والأمن، تربط منظورات الشباب في الإقليم بمحادثات أوسع حول السلام والأمن.\n\nوهي أيضًا مؤسسة مبادرة Huellas de Poder المجتمعية التي تدعم قيادة النساء الأصليات ومشاركتهن في المناطق الريفية في الإكوادور، وتوفّر فضاءات للانخراط في حل النزاعات والسلام والأمن. شمل عملها أيضًا جماعة الأنديز ووفد الاتحاد الأوروبي في الإكوادور.\n\nتحمل ماجستير في الحوكمة العالمية والدبلوماسية بامتياز من جامعة ليدز، وبكالوريوس في العلاقات الدولية بتقدير Summa Cum Laude.",
    },
    {
      id: "abdul-rahman-jalil",
      name: "عبد الرحمن جليل",
      role: "منسق إقليمي – آسيا والشرق الأوسط",
      image: teamImage("abdul-rahman-jalil"),
      alt: "صورة عبد الرحمن جليل",
      bio: "عبد الرحمن جليل ناشط شبابي ومدافع عن حقوق الإنسان من أفغانستان، ملتزم بدفع السلام والإدماج. بصفته منسقًا إقليميًا لشبكة الاتحاد الأوروبي للشباب والسلام والأمن لآسيا والشرق الأوسط، يعمل على ربط الناشطين الشباب عبر الحدود وتعزيز الحوار والتعاون حول التحديات المشتركة.\n\nيعمل أيضًا مدير برامج في منظمة الأفغان للتفكير التقدمي (2022 – حتى اليوم)، داعمًا وصول الشباب إلى الفرص التعليمية والمناصرة في قضايا حقوق الإنسان وتيسير فضاءات آمنة للحوار والتواصل.",
    },
    {
      id: "shan-rasheed",
      name: "شان رشيد",
      role: "التواصل – باكستان",
      image: teamImage("shan-rasheed"),
      alt: "صورة شان رشيد",
      bio: "شان رشيد متخصص في إشراك الشباب وبناء السلام من باكستان، شغوف بحقوق الإنسان والوئام بين الأديان والمشاركة الشاملة للشباب. بصفته مدير شؤون الطلاب في معهد خالد محمود للعلوم الطبية (KIMS)، يدعم تنمية الطلاب ومشاركتهم.\n\nسابقًا، كمسؤول التواصل وتقنية المعلومات في منظمة Human Friends Organization (HFO)، ساهم في مبادرات لتعزيز تمكين الشباب وحرية الدين أو المعتقد (FoRB) وبناء السلام عبر التواصل والمناصرة والانخراط المجتمعي.\n\nبصفته عضوًا في شبكة الاتحاد الأوروبي للشباب والسلام والأمن، يساهم شان في رسم أولويات الشباب في باكستان، مضخمًا أصوات الشباب وتعزيز مشاركتهم الهادفة في الحوار الشامل وبناء السلام.",
    },
  ],
  joinTitle: "انضم أو راسل الشبكة",
  joinIntro:
    "أرسل رسالة إلى الشبكة. يصلك بريد تأكيد يتضمن مجموعة واتساب للإقليم الذي تختاره.",
  form: {
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    organisation: "المنظمة",
    place: "المدينة أو البلد",
    region: "الإقليم",
    access: "ترتيبات تيسير الوصول",
    accessHint:
      "اختياري. أمثلة: قاعات بلا درجات، ترجمة نصية، صيغ لقارئ الشاشة، لغة إشارة، أماكن أهدأ، أو وقت إضافي.",
    message: "لماذا تريد التواصل",
    messageHint: "بضع جمل تكفي. اذكر إن كنت تكتب بصفة شخصية أو باسم منظمة.",
    regionHint: "بريد التأكيد يتضمن مجموعة واتساب لهذا الإقليم.",
    consent: "أوافق على إرسال هذه الرسالة إلى الشبكة وعلى استلام بريد تأكيد.",
    required: "مطلوب",
    optional: "اختياري",
    submit: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    regionPlaceholder: "اختر إقليمًا",
    errors: {
      name: "أدخل اسمك.",
      email: "أدخل بريدًا إلكترونيًا مثل name@example.com.",
      region: "اختر إقليمًا.",
      message: "اكتب رسالة قصيرة حتى تعرف الشبكة سبب كتابتك.",
      consent: "أكّد أن الشبكة يمكن أن تراسلك بخصوص هذه الرسالة.",
      captcha: "أكمل التحقق قبل الإرسال.",
      rate: "انتظر بضع دقائق قبل إرسال رسالة أخرى.",
      send: "تعذر إرسال الرسالة. حاول بعد لحظة، أو راسل الشبكة مباشرة.",
      unconfigured: "البريد غير موصول بعد. راسل العنوان أعلاه في الوقت الحالي.",
    },
    errorHeading: "صحّح هذه الحقول",
    errorCount: "يلزم الانتباه إلى {n} من الحقول قبل إرسال الرسالة.",
    successTitle: "تم إرسال الرسالة",
    noneStated: "لم يُذكر شيء",
    popups: "نُفذة الطباعة محجوبة. اسمح بالنوافذ المنبثقة أو استخدم التنزيل.",
  },
  footerBlurb:
    "تعبّئ الشبكة الأوروبية للشباب والسلام والأمن (شبكة EYPS) الشباب حول العالم من أجل السلام والأمن والتنمية المستدامة، بما يتسق مع أجندة الأمم المتحدة للشباب والسلام والأمن.",
  footerNav: "صفحات الموقع",
  socialTitle: "التواصل الاجتماعي",
  social: {
    linkedin: "تحالف الاتحاد الأوروبي للشباب والسلام والأمن على LinkedIn (يفتح في تبويب جديد)",
    instagram: "تحالف الاتحاد الأوروبي للشباب والسلام والأمن على Instagram (يفتح في تبويب جديد)",
  },
  privacyTitle: "الخصوصية",
  privacy:
    "حجم النص والتباين واللغة المبسطة واختيار اللغة تُحفظ في هذا المتصفح فقط. نموذج الانضمام يُرسل بالبريد إلى الشبكة ويصلك بريد تأكيد. لا تضع كلمات مرور أو أرقام وثائق هوية في الرسالة.",
  contactTitle: "للاستفسار",
  backToTop: "العودة إلى الأعلى",
  sitemapLabel: "خريطة الموقع",
  llmsLabel: "معلومات للذكاء الاصطناعي",
  rights: "الشبكة الأوروبية للشباب والسلام والأمن (شبكة EYPS).",
  madeBy: "الموقع من إعداد",
  madeByName: "عبادة الطرزي",
  madeBySite: "cupcoding.com",
  announced: {
    lang: "تم ضبط اللغة على العربية.",
    contrastOn: "التباين العالي مفعّل.",
    contrastOff: "التباين العالي متوقف.",
    plainOn: "اللغة المبسطة مفعّلة.",
    plainOff: "اللغة المبسطة متوقفة.",
    smaller: "تم تصغير النص.",
    larger: "تم تكبير النص.",
    limit: "حجم النص عند الحد أصلًا.",
    menuOpen: "فُتحت القائمة.",
    menuClose: "أُغلقت القائمة.",
    a11yOpen: "فُتحت خيارات إمكانية الوصول.",
    a11yClose: "أُغلقت خيارات إمكانية الوصول.",
    resources: "يُعرض {n} من الموارد.",
  },
  pillars: [
    {
      id: "participation",
      title: "المشاركة",
      lede: "بناة السلام الشباب داخل القرار، لا في الجلسة الافتتاحية فقط.",
      body: "يهيئ الأعضاء بعضهم لمجالس محلية ومنتديات إقليمية واجتماعات دولية. المقصود البقاء في المسار بعد البيان: صياغة اللغة، ومتابعة الميزانيات، والسؤال عما تغيّر.",
      plain:
        "ينبغي أن يشارك الشباب في قرارات السلام، لا في الصورة فقط. يتدرّب الأعضاء على الكلام بأدلة وعلى المتابعة بعد الاجتماعات.",
      points: [
        "تهيئة الأعضاء قبل الاجتماعات السياسية والدبلوماسية واجتماعات السياسات.",
        "مشاركة ما قيل وما رُفض مع الناس في البلد.",
        "متابعة ما إذا صارت لغة الشباب في النص بندًا في الميزانية.",
      ],
    },
    {
      id: "protection",
      title: "الحماية",
      lede: "إبقاء بناة السلام الشباب والمدافعين عن المناخ وحقوق الإنسان قادرين على الاستمرار.",
      body: "ضيق الفضاء المدني والتهديد المباشر جزء من العمل، لا حالة نادرة. الحماية هنا عادات عملية: معرفة الخطر قبل السفر، والاتفاق على استجابة المجموعة، ومعاملة الإساءة الرقمية كعنف.",
      plain:
        "بعض بناة السلام الشباب يُهدَّدون بسبب عملهم. تشارك الشبكة خطوات سلامة بسيطة للسفر والاجتماعات والإنترنت، وتساند من يحتاج إلى التراجع.",
      points: [
        "فحص المخاطر قبل اجتماع علني أو عبور حدود.",
        "الاتفاق على من يُتصل به إذا احتُجز أحد أو نُشرت بياناته أو لوحق.",
        "لا تطلبوا الشجاعة بدل الاستعداد.",
      ],
    },
    {
      id: "prevention",
      title: "الوقاية",
      lede: "العمل على أسباب بدء العنف، ما دام الوقت يسمح بتغييرها.",
      body: "تشمل الوقاية خطاب الكراهية، والتجنيد في التطرف العنيف، والنزاع الذي يفاقمه الضغط المناخي. البرامج يقودها المجتمع الذي سيعيش النتيجة، لا فريق يزور لعطلة نهاية أسبوع.",
      plain:
        "أوقفوا العنف مبكرًا. هذا يشمل خطاب الكراهية، والجماعات التي تجر الشباب إلى العنف المتطرف، والنزاعات التي يزيدها الضغط المناخي. الشباب المحلي ينبغي أن يقود.",
      points: [
        "سمّوا المظلمة المحلية قبل رفع شعار إقليمي.",
        "افصلوا الجدال الصحي عن الكلام الذي ينزع الإنسانية.",
        "اقرنوا الإنذار المبكر بفعل يستطيع المجتمع القيام به فعلًا.",
      ],
    },
    {
      id: "partnerships",
      title: "الشراكات",
      lede: "ربط شبكات الشباب بمؤسسات لديها تفويض أصلًا.",
      body: "يجلس الأعضاء مع المجتمع المدني الوطني ومع هيئات متعددة الأطراف — بما فيها مؤسسات الاتحاد الأوروبي وقنوات الأمم المتحدة. أطر أجندة الأمم المتحدة للشباب والسلام والأمن — التي يساعد الاتحاد الأوروبي على تنفيذها — نقاط مرجع للتنسيق، لا شعارات لشريحة عرض.",
      plain:
        "لا ينبغي أن تعمل المجموعات الشبابية وحدها. تتصل بمنظمات محلية وبهيئات أكبر مثل الاتحاد الأوروبي والأمم المتحدة.",
      points: [
        "اسألوا ماذا تستطيع المؤسسة أن تموّل أو تحمي أو تنشر — بالتحديد.",
        "أبقوا المنظمات الشبابية مؤلفة للعمل، لا ضيوفًا مدعوين.",
        "اكتبوا الشراكة حتى تبقى إذا تغيّر الموظفون.",
      ],
    },
    {
      id: "reintegration",
      title: "فك الارتباط وإعادة الإدماج",
      lede: "طريق عودة إلى الحياة المدنية للشباب الذين اقتربوا من النزاع المسلح أو التشدد.",
      body: "تفشل إعادة الإدماج حين تكون شعارًا عن فرصة ثانية فقط. يعمل الأعضاء على عودة عملية: قرين ليس موظف حالة، ومهارة تُدفع فعلًا، ومجتمع يقبل أن يعود الشخص عاديًا.",
      plain:
        "بعض الشباب اقتربوا من جماعات مسلحة أو أفكار عنيفة ويريدون مخرجًا. المساعدة تعني عملًا، وأصدقاء ليسوا شرطة، ومجتمعًا يسمح لهم بالبدء من جديد.",
      points: [
        "لا تصنعوا قصة علنية عن شخص يحتاج إلى الخصوصية.",
        "قدّموا دورًا في حياة المجتمع، لا جلسة إرشاد واحدة فقط.",
        "انتبوا للوصمة داخل المجموعة الشبابية نفسها.",
      ],
    },
  ],
  hubs: [
    {
      id: "west-africa",
      title: "غرب أفريقيا",
      lede: "تنسيق إقليمي لأعضاء غرب أفريقيا.",
      body: "يسهّل المسؤولون الإقليميون التواصل بين الأعضاء، ويدعمون أنشطة الشبكة، ويعزّزون التكامل بين المبادرات المحلية والإقليمية والدولية انطلاقًا من واقع غرب أفريقيا.",
      plain:
        "في غرب أفريقيا يساعد المنسقون الأعضاء على التواصل وإدارة الأنشطة وربط العمل المحلي بالشبكة الأوسع.",
      points: [
        "تعزيز العدالة والسلام وحقوق الإنسان والقيم الأوروبية المشتركة.",
        "تشجيع انخراط الشباب في السلام والأمن والتنمية.",
        "تبادل المعلومات والفرص والممارسات الجيدة.",
      ],
    },
    {
      id: "central-africa",
      title: "وسط أفريقيا",
      lede: "تنسيق إقليمي لأعضاء وسط أفريقيا.",
      body: "يربط هذا الإقليم بناة السلام الشباب في سياقات متنوعة وكثيرًا ما تكون هشة. يدعم المسؤولون المشاركة في مبادرات الشبكة والاستشارات والتعاون عبر الحدود.",
      plain:
        "في وسط أفريقيا يساعد المنسقون بناة السلام الشباب على المشاركة في أنشطة الشبكة والعمل عبر الحدود.",
      points: [
        "تعزيز الشراكات بين الشباب والمجتمع المدني والمؤسسات.",
        "دعم مشاركة الأعضاء في الاستشارات والأنشطة.",
        "إيصال أولويات الإقليم إلى العمل الدولي للشبكة.",
      ],
    },
    {
      id: "esa",
      title: "شرق أفريقيا والجنوب الأفريقي",
      lede: "تنسيق إقليمي عبر شرق أفريقيا والجنوب الأفريقي.",
      body: "يعزّز المسؤولون الروابط بين الأعضاء، ويشجعون الحوار بين الثقافات، ويدعمون تنفيذ أجندة الشباب والسلام والأمن عبر سياقات جغرافية واجتماعية وسياسية متنوعة في الإقليم.",
      plain:
        "في شرق أفريقيا والجنوب الأفريقي يربط المنسقون الأعضاء ويدعمون الحوار ويساعدون على تطبيق أجندة الشباب والسلام والأمن محليًا.",
      points: [
        "تيسير تبادل الفرص والممارسات الجيدة.",
        "دعم تمثيل شامل لوجهات النظر الإقليمية.",
        "ربط المبادرات المحلية بالعمل الإقليمي والدولي.",
      ],
    },
    {
      id: "europe",
      title: "أوروبا",
      lede: "أعضاء أوروبيون يربطون العمل المحلي بأجندة الأمم المتحدة للشباب والسلام والأمن.",
      body: "يربط إقليم أوروبا منصات الشباب الأوروبية بشبكة EYPS العالمية وبمحادثات الاتحاد الأوروبي حول تنفيذ أجندة الأمم المتحدة للشباب والسلام والأمن. يمكن أن تبدأ استفسارات الشبكة الأوسع من صندوق البريد المشترك.",
      plain:
        "في أوروبا يربط الأعضاء المجموعات الشبابية الأوروبية بالشبكة العالمية وبمحادثات الاتحاد الأوروبي حول وضع أجندة الأمم المتحدة للشباب والسلام والأمن موضع التنفيذ.",
      points: [
        "جسر إلى أطر أجندة الأمم المتحدة للشباب والسلام والأمن وتنفيذها في الاتحاد الأوروبي.",
        "ربط الأعضاء الأوروبيين بالمحاور حول العالم.",
        "استفسارات مشتركة عبر euypsnet@gmail.com.",
      ],
    },
    {
      id: "lac",
      title: "أمريكا اللاتينية والكاريبي",
      lede: "تنسيق إقليمي عبر أمريكا اللاتينية والكاريبي.",
      body: "يجمع هذا الإقليم ناشطين ومنظمات شبابية تعمل من أجل السلام والإدماج والتنمية المستدامة. يعزّز المنسقون الإقليميون التعاون بين الأعضاء ومع الشبكة الأوسع.",
      plain:
        "في أمريكا اللاتينية والكاريبي يساعد المنسقون الناشطين الشباب على العمل معًا من أجل السلام والإدماج والتنمية.",
      points: [
        "تعزيز التعاون الشبابي عبر الحدود.",
        "دعم مشاركة الأعضاء في مبادرات الشبكة.",
        "ضمان سماع أولويات الإقليم دوليًا.",
      ],
    },
    {
      id: "asia-me",
      title: "آسيا والشرق الأوسط",
      lede: "تنسيق إقليمي عبر آسيا والشرق الأوسط.",
      body: "يربط هذا الإقليم الناشطين الشباب عبر الحدود، ويعزّز الحوار والتعاون حول التحديات المشتركة. يدعم المنسقون الإقليميون الفرص التعليمية ومناصرة حقوق الإنسان والفضاءات الآمنة للتواصل.",
      plain:
        "في آسيا والشرق الأوسط يربط المنسقون الناشطين الشباب عبر الحدود للحوار والتعلم والتعاون.",
      points: [
        "ربط الناشطين عبر الحدود حول التحديات المشتركة.",
        "دعم فضاءات الحوار والتعليم والتواصل.",
        "ربط الأولويات المحلية بشبكة EYPS العالمية.",
      ],
    },
  ],

  resources: [
    {
      id: "esa-webinar-concept-note",
      kind: "brief",
      title: "ندوة شرق وجنوب أفريقيا الإقليمية — مذكرة مفاهيمية",
      summary:
        "مذكرة مفاهيمية لندوة مركز شرق وجنوب أفريقيا حول المعلومات المضلّلة والمغلوطة والخبيثة (16 تشرين الأول/أكتوبر 2026).",
      body: "ندوة افتراضية لشبكة الاتحاد الأوروبي للشباب والسلام والأمن في إقليم شرق وجنوب أفريقيا حول سلامة المعلومات، مع كينيا كدراسة حالة رئيسية ومقارنات قصيرة من الإقليم.\n\nالتاريخ: الخميس 16 تشرين الأول/أكتوبر 2026، 6:00–8:00 مساءً بتوقيت شرق أفريقيا. نزّلوا ملف PDF للأهداف والمنهجية والمتحدث والنتائج المتوقعة.\n\nراسلوا euypsnet@gmail.com إن احتجتم صيغة ميسّرة.",
      fileHref: "/documents/ESA_Regional_Webinar_Concept_Note_16_Oct_2026.pdf",
    },
    {
      id: "esa-webinar-program",
      kind: "brief",
      title: "ندوة شرق وجنوب أفريقيا الإقليمية — مسودة البرنامج",
      summary:
        "مسودة برنامج جلسة الندوة الإقليمية لشرق وجنوب أفريقيا حول سلامة المعلومات (16 تشرين الأول/أكتوبر 2026).",
      body: "برنامج مسودة لمدة ساعتين يغطي تعريفات اضطراب المعلومات، وكيف يجري التلاعب بالمحتوى، وإطار الانتخابات والاحتجاجات في شرق أفريقيا، وتمارين تحقق مباشرة، وعرض أداة AmaniCheck.\n\nالتاريخ: الخميس 16 تشرين الأول/أكتوبر 2026. نزّلوا ملف PDF لمقاطع الجلسة الموقوتة.\n\nشاركوها مع المنظّمين والمشاركين قبل الجلسة. راسلوا euypsnet@gmail.com إن احتجتم صيغة ميسّرة.",
      fileHref: "/documents/ESA_Regional_Webinar_Program_16_Oct_2026.pdf",
    },
    {
      id: "together-for-peace-agenda",
      kind: "brief",
      title: "معًا من أجل السلام — الأجندة",
      summary: "أجندة برنامج «معًا من أجل السلام» المحدّثة (ملف PDF).",
      body: "هذه أجندة «معًا من أجل السلام» المحدّثة. نزّلوا ملف PDF للاطلاع على الجدول الكامل وتفاصيل الجلسات.\n\nشاركوها مع المنظّمين والمشاركين قبل الفعالية. راسلوا euypsnet@gmail.com إن احتجتم صيغة ميسّرة.",
      fileHref: "/documents/Together_for_Peace_Agenda_updated.pdf",
    },
    {
      id: "unscr-primer",
      kind: "brief",
      title: "ماذا تطلب القرارات 2250 و2419 و2535 فعلًا",
      summary: "قراءة قصيرة للقرارات الثلاثة بلغة يومية.",
      body: "القرار 2250 (2015) يطلب من الدول إشراك الشباب في منع العنف وبناء السلام. وهو منظّم حول المشاركة والحماية والوقاية والشراكات وفك الارتباط وإعادة الإدماج.\n\nالقرار 2419 (2018) يقول إن الشباب ينبغي أن يكونوا جزءًا من التفاوض على اتفاقات السلام وتنفيذها، لا في مشاريع مجتمعية إلى جانب المسار الرسمي فقط.\n\nالقرار 2535 (2020) يدفع منظومة الأمم المتحدة إلى تتبّع الحماية والمشاركة، وإلى الصراحة بشأن الفجوات.\n\nاستخدموا هذا الموجز للتحضير لاجتماع. هو ليس رأيًا قانونيًا ولا يغني عن القرارات نفسها.",
    },
    {
      id: "cps-note",
      kind: "brief",
      title: "المناخ والسلام والأمن في عمل الشباب",
      summary: "كيف يظهر النزوح ومخاطر الكوارث في عمل السلام الشبابي.",
      body: "في كثير من الأقاليم، العاصفة حدث سياسي أيضًا. الأرض والماء والمأوى والمساعدة تصبح محل نزاع. عمل سلام شبابي يتجاهل هذا سيتحدث عن الحوار بينما الناس يتحركون أصلًا.\n\nاسألوا ثلاثة أسئلة في أي مشروع مناخي:\n1. من يفقد مكان سكنه، ومن يقرر إلى أين يذهب؟\n2. أي توتر قائم يسوء حين تنقص الموارد؟\n3. هل الشابات والشباب ذوو الإعاقة داخل التقييم، أم في الصورة فقط؟\n\nاقرنوا الإنذار المبكر بفعل محلي يمكن القيام به من غير منحة جديدة.",
    },
    {
      id: "digital-toolkit",
      kind: "toolkit",
      title: "بناء السلام الرقمي والسلامة السيبرانية",
      summary: "عادات للتنظيم عبر الإنترنت حين يغلق خطاب الكراهية والتكلفة الباب.",
      body: "قبل أي حملة، اتفقوا على ما لا يُنشر أبدًا: عناوين المنازل، وخطط السفر، وصور وثائق الهوية، والخلافات الخاصة.\n\nقائمة مشتركة:\n- من يستطيع قفل الحساب إذا أُخذ الهاتف؟\n- هل توجد طريقة للانضمام باتصال ضعيف، مثل الصوت فقط أو ملخص مكتوب؟\n- كيف ترد المجموعة على كذبة عنها من غير تضخيم الكذبة؟\n- ماذا تفعل المجموعة حين تكون الإساءة مبنية على النوع الاجتماعي أو موجهة إلى أعضاء ذوي إعاقة؟\n\nالوصول الرقمي جزء من المشاركة. أداة لا تعمل إلا على هاتف جديد باب مغلق.",
    },
    {
      id: "inclusion-toolkit",
      kind: "toolkit",
      title: "إدماج الشباب ذوي الإعاقة",
      summary: "خطّطوا للتيسير قبل الدعوات، وضعوه في الميزانية مثل أي كلفة قاعة.",
      body: "اسألوا الناس عما يحتاجون. لا تخمّنوا، ولا تنتظروا أسبوع الفعالية.\n\nفحوصات دنيا:\n- مسار بلا درجات من الشارع إلى المقعد والمرحاض والمخرج.\n- وثائق تعمل مع قارئ الشاشة، تُرسل مسبقًا.\n- ترجمة نصية أو لغة إشارة حين يكون الكلام وسيلة المعلومات الأساسية.\n- استراحات ومكان هادئ ووقت لا يعاقب من يحتاج مدة أطول.\n- ميسرون لا يقاطعون من يستخدم مترجمًا أو وسيلة تواصل.\n\nادفعوا لتيسير الوصول كما تدفعون للقاعة. إذا لم يوجد بند في الميزانية، فالفعالية غير جاهزة.",
    },
    {
      id: "five-pillars-training",
      kind: "training",
      title: "تيسير جلسة الركائز الخمس",
      summary: "مخطط لتسعين دقيقة لأعضاء يلتقون أول مرة.",
      body: "الهدف: كل شخص يشير إلى ركيزة تمارسها مجموعته أصلًا، وركيزة تتجنبها.\n\n0–10 د. الأسماء، واحتياجات التيسير، وما يريده الناس من الساعة.\n10–25 د. اقرأوا أسماء الركائز الخمس جهرًا. اسألوا أي كلمة غير واضحة.\n25–60 د. في ثنائيات، اختاروا نشاطًا حقيقيًا وضعوه تحت ركيزة. إذا ناسب اثنتين، قولوا لماذا.\n60–80 د. شاركوا فجوة واحدة المجموعة مستعدة للعمل عليها خلال شهر.\n80–90 د. اتفقوا من يكتب الملاحظة، ومن لا يجوز ذكر اسمه علنًا.\n\nتوقفوا إذا لم تكن الغرفة آمنة بما يكفي لأمثلة صادقة. السلامة أهم من الأجندة.",
    },
    {
      id: "reintegration-note",
      kind: "training",
      title: "فك الارتباط وإعادة الإدماج، بحذر",
      summary: "ملاحظات عملية لدعم العودة إلى حياة مدنية عادية.",
      body: "لا تعدوا ببرنامج لا تستطيعون حمايته. عمل إعادة الإدماج قد يعرّض الشخص والميسر.\n\nمبادئ:\n- الخصوصية أولًا. لا قصة نجاح من غير موافقة مستمرة ومستنيرة.\n- دور مدفوع أو مهارة حقيقية أفضل من ورشة لمرة واحدة.\n- على المجموعة الشبابية أن تواجه خوفها ووصمتها، وإلا ستعيد الإقصاء.\n- اعرفوا جهة الإحالة إذا كان أحد في خطر فوري، واعرفوا حدودها.\n\nإذا لم يكن لمجموعتكم شريك محلي لهذه الركيزة، قولوا ذلك. الادّعاء أخطر من الفجوة.",
    },
    {
      id: "partnerships-brief",
      kind: "brief",
      title: "شراكات مع سياسة الشباب الأوروبية والبحث عن أرضية مشتركة",
      summary: "كيف تحضرون بصفتكم مؤلفين حين تفتح مؤسسة أكبر بابًا.",
      body: "الشراكة مفيدة حين تغيّر الحماية أو المال أو نص السياسة. تبادل الشعارات ليس شراكة.\n\nعند التعامل مع أطر سياسة الشباب في الاتحاد الأوروبي أو مسارات منظمة البحث عن أرضية مشتركة، جهّزوا:\n- القرار الذي تريدون التأثير فيه، في جملة واحدة.\n- أدلة من الأعضاء، بإذن لمشاركتها.\n- احتياجات تيسير الوصول لأي شخص تقدمونه للتحدث.\n- ما لن تتنازلوا عنه، مثل تسمية مجتمع طلب ألا يُسمّى.\n\nغادروا بخطوة تالية مكتوبة واسم. أبلغوا الأعضاء بلغة واضحة.",
    },
    {
      id: "protection-basics",
      kind: "toolkit",
      title: "أساسيات الحماية قبل السفر أو النشر",
      summary: "قائمة قصيرة لبناة السلام الشباب قبل دور علني.",
      body: "قبل السفر:\n- أخبروا شخصين بخطتكم ومتى ينبغي أن تتطمئنا.\n- احملوا ما يلزمكم إذا أُخذ الهاتف. لا تحملوا ما يؤذي آخرين إذا أُخذ.\n- اعرفوا أي الاجتماعات علنية وأيها مغلقة.\n\nقبل النشر:\n- احذفوا المواقع، ووجوه من لم يوافقوا، والوثائق.\n- افترضوا قارئًا معادياً. الإهانة ليست خطة أذى، لكن لا تتجاهلوا خطة.\n- اتفقوا من يتحدث للإعلام حتى لا تُفاجأ بقية المجموعة.\n\nبعد حادث، اعتنوا بالشخص أولًا. البيان يمكن أن ينتظر.",
    },
  ],
};

export const copy: Record<Lang, Copy> = { en, ar };

export function fill(template: string, n: number) {
  return template.replaceAll("{n}", String(n));
}

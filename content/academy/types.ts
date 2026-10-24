/**
 * The academy's data model.
 *
 * One shape feeds everything the academy renders: the promotional block on the
 * home page, the landing page at `/academy` and every lesson page under
 * `/academy/<slug>`. Nothing about a lesson is declared outside its `LessonDTO`
 * record, so adding, removing or re-ordering a lesson is a single edit in
 * `content/academy/records.ts` — the landing page and the lesson pages read the
 * same source of truth and can never disagree.
 *
 * Copy is stored as data, never as markup: `description` is an array of
 * paragraphs and the components lay them out. A record therefore stays plain,
 * editable Persian text with no styling decisions inside it.
 *
 * ── Access, and the future SpotPlayer workflow ──────────────────────────────
 * This first version sells nothing from the site. Three introductory lessons are
 * free, the complete collection is bought by talking to Norsta on Instagram, and
 * the administrator then hands the customer their player licence by hand.
 *
 * The model below therefore describes access and nothing else:
 *
 *   · `LessonAccess` is the only commercial field — `"free"` today, and
 *     `"paid"` for anything a future licensed workflow would unlock.
 *   · There is deliberately no price, cart, order, receipt, entitlement or
 *     licence-key shape here, because the site never sees a payment and must
 *     never store a key.
 *
 * When SpotPlayer is wired up later, the natural seam is a *server-side*
 * resolver keyed on `slug` and `access` (plus whatever the customer holds) that
 * answers one question — "may this visitor watch this lesson?" — and returns the
 * playable source for it. `LessonVideoDTO` is already the shape that answer
 * would take, so no lesson record, page or component would have to change.
 */

/** A photograph plus the alt text that describes what it actually shows. */
export type AcademyImage = {
  src: string;
  alt: string;
  /** Optional caption, printed under the figure in a lesson page's gallery. */
  caption?: string;
};

/**
 * Who may watch a lesson.
 *
 * `"free"` is the three introductory lessons and needs no check at all;
 * `"paid"` marks material that a future licence-aware resolver would gate. It is
 * a classification only — nothing in this version enforces it, and no lesson
 * currently uses it.
 */
export type LessonAccess = "free" | "paid";

/**
 * A lesson's video, when there is one.
 *
 * The union keeps the two realistic sources expressible without inventing
 * either: a file this site hosts and serves itself, or an embeddable player page
 * from a provider (the shape a licensed player would hand over). A record with
 * no `video` at all is the honest state of this first version — no lesson ships
 * a recording yet — and the lesson page answers that state with its own
 * placeholder rather than an empty player.
 */
export type LessonVideoDTO =
  | {
      kind: "file";
      /** Local path (`/images/…`) or absolute URL. */
      src: string;
      /** Optional still shown before playback; falls back to the lesson cover. */
      poster?: string;
      /** Optional `type` hint, e.g. `video/mp4`. */
      mimeType?: string;
    }
  | {
      kind: "embed";
      /** The provider's player URL (https). */
      src: string;
      /** Accessible name for the frame — required, since an iframe has no text. */
      title: string;
    };

/**
 * A complete academy lesson.
 *
 * `id` and `slug` are the two identities: `id` is the stable key used by React
 * and by re-ordering, `slug` is the public URL segment (`/academy/<slug>`).
 */
export type LessonDTO = {
  /** Stable numeric key — free to change order without touching routes. */
  id: number;
  /** URL segment: English keywords, kebab-case, no Persian, never re-used. */
  slug: string;
  /**
   * Position in the learning sequence, 1-based. The card prints it as a two-up
   * Persian number and the lesson page uses it for prev/next, so this is the
   * single ordering authority — `getAllLessons()` sorts on it.
   */
  order: number;
  /** Display title (Persian). */
  title: string;
  /** One or two sentences: the card's line. */
  summary: string;
  /** The lesson page's standfirst — the same subject, written out a little. */
  description: string;
  /** What the lesson introduces, one entry per outcome. */
  outline: string[];
  /** The card's plate and the lesson page's cover. */
  coverImage: AcademyImage;
  /**
   * Omitted while no recording exists. A lesson without one renders the Persian
   * "coming soon" placeholder instead of a broken player.
   */
  video?: LessonVideoDTO;
  /**
   * Whole minutes. Printed only when a real figure is configured, so no duration
   * is ever implied for a lesson nobody has timed yet.
   */
  durationMinutes?: number;
  /** Whether the lesson is free or reserved for a future licensed workflow. */
  access: LessonAccess;
  /** `<title>` for the lesson page. The academy's name is appended by its layout. */
  seoTitle: string;
  /** `<meta name="description">`, roughly 120–165 characters. */
  seoDescription: string;
};

/**
 * The instructor the academy's lessons are attributed to.
 *
 * The record carries no biography, credential, award or year count, because none
 * has been supplied and Norsta's rules forbid inventing one. `image` is a
 * material photograph of the studio's own work rather than a portrait, and its
 * alt text says what the photograph actually shows.
 */
export type AcademyInstructorDTO = {
  /** Full name, as it must appear on the home page and the landing page. */
  name: string;
  /** The line under the name: the role the academy actually claims. */
  role: string;
  /** The photograph the instructor block is composed around. */
  image: AcademyImage;
  /** The introduction, one paragraph per entry. */
  intro: string[];
  /** What these lessons walk through, one short entry each. */
  focus: string[];
  /** The line that credits her, used verbatim wherever she is named. */
  credit: string;
};

/**
 * The complete training collection, sold through Instagram in this phase.
 *
 * `outcomes` is deliberately a plain list of strings: the value of the
 * collection is described by the topics it covers, and every one of them is
 * edited in `content/academy/config.ts` without touching a component.
 */
export type TrainingCollectionDTO = {
  /** The collection's own name, used in its copy and metadata. */
  name: string;
  /** The section's heading. */
  title: string;
  /** Eyebrow above the heading. */
  eyebrow: string;
  /** The explanation of what the collection holds, one paragraph per entry. */
  description: string[];
  /** Configurable learning outcomes. An empty list simply prints nothing. */
  outcomes: string[];
  /** Label of the button that leads to the purchase enquiry. */
  ctaLabel: string;
  /** The supporting note under the button: how a purchase is actually handled. */
  ctaNote: string;
  /** Where the enquiry goes — a full https URL. */
  instagramUrl: string;
  /** The collage the section is composed from, in order. */
  images: AcademyImage[];
};

/** The academy's own editorial copy (hero and section headings). */
export type AcademyCopy = {
  /** Used as the `<title>` segment for every `/academy` route. */
  name: string;
  /** The hero's eyebrow. */
  eyebrow: string;
  /** The hero's headline, one entry per designed line. */
  titleLines: string[];
  /** The hero's supporting paragraph. */
  lede: string;
  /** Label of the hero's primary action (scrolls to the free lessons). */
  ctaPrimary: string;
  /** Label of the hero's secondary action (the purchase enquiry). */
  ctaSecondary: string;
  /** The free-lessons section's heading and introduction. */
  lessonsTitle: string;
  lessonsIntro: string;
  /** The instructor block's eyebrow. */
  instructorEyebrow: string;
  /** The homepage promotional block's own headline and description. */
  promoEyebrow: string;
  promoTitle: string;
  promoBody: string;
  promoCtaLabel: string;
  promoNote: string;
};

/** Micro-labels shared by the cards, the lesson page and the not-found body. */
export type AcademyLabels = {
  /** The badge on a free lesson card. */
  free: string;
  /** Prefix of the lesson number, e.g. «درس ۰۱». */
  lesson: string;
  /** The card's call to action. */
  view: string;
  /** Unit printed after a duration, e.g. «۱۲ دقیقه». */
  minutes: string;
  /** Eyebrow of the learning-sequence line on a lesson page. */
  sequence: string;
  /** Heading of a lesson's outline list. */
  outline: string;
  /** Heading of the related-lessons row. */
  related: string;
  /** Prev/next controls. */
  previous: string;
  next: string;
  /** Back link at the top of a lesson page. */
  back: string;
  /** The placeholder shown while a lesson has no recording. */
  videoSoonTitle: string;
  videoSoonBody: string;
  /** The instructor's credit line, e.g. «مدرس: افسانه مردانی». */
  instructorBy: string;
  /** The label above the collection's purchase note. */
  purchaseNoteLabel: string;
  /** The segment's 404 body. */
  notFoundTitle: string;
  notFoundLede: string;
  notFoundAction: string;
};

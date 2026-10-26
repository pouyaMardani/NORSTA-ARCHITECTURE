/**
 * The studio's second channel: its WhatsApp line.
 *
 * ── THE ONE PLACE THE NUMBER LIVES ─────────────────────────────────────────
 * `WHATSAPP_PHONE_E164` below is the single configuration point. Replace the
 * placeholder with the studio's own number, written in the international form
 * `wa.me` addresses: country code and digits only — no `+`, no spaces, no
 * dashes, no brackets (`98…` for Iran). Nothing else in the repository spells
 * the number out, so that one edit moves every link the site publishes.
 *
 * ── A CONSTANT, NOT A `NEXT_PUBLIC_*` VARIABLE ─────────────────────────────
 * `lib/site.ts` reads `NEXT_PUBLIC_SITE_URL` because a deployment has to hand
 * each build its own origin. A telephone number is not per-environment: it is
 * a fact about the studio, and because the site is fully prerendered the value
 * has to be known at build time either way. A constant keeps it in one place
 * and readable in a diff, so there is no second source to fall out of step.
 *
 * ── WHAT A PLACEHOLDER MUST NOT DO ─────────────────────────────────────────
 * The number is not published yet, and no stand-in digits are used to fill the
 * gap: a plausible wrong number dials a stranger, which is worse than no link
 * at all. The value below is therefore a token rather than digits, and
 * `WHATSAPP_URL` stays `null` until it is replaced — there is no code path
 * that can build a `wa.me` link out of a value that has not been configured.
 * The showcase reads `WHATSAPP_URL`, and the closing section renders its quiet
 * "not published yet" state instead, so nothing on the page ever promises a
 * destination the studio cannot answer.
 */

/** Replace with the studio's own number in the `wa.me` form: country code and digits only. */
export const WHATSAPP_PHONE_E164 = "REPLACE_WITH_WHATSAPP_NUMBER";

/**
 * E.164 as `wa.me` accepts it: a leading non-zero digit (a country code never
 * starts with `0`) followed by 7–14 more, so 8 to 15 digits in all and no
 * separators. Anything else — the placeholder token, a number written with a
 * `+`, a local number without a country code — is treated as *unset* rather
 * than guessed at.
 */
const E164 = /^[1-9]\d{7,14}$/;

/** Whether a usable number has been configured. Drives the WhatsApp entry's status word. */
export const WHATSAPP_CONFIGURED: boolean = E164.test(WHATSAPP_PHONE_E164.trim());

/**
 * The chat link, or `null` while no usable number is configured.
 *
 * It is a full absolute URL rather than a path (the chat is not on this
 * origin), so a component can hand it straight to `href` without knowing how
 * `wa.me` addresses a conversation.
 */
export const WHATSAPP_URL: string | null = WHATSAPP_CONFIGURED
  ? `https://wa.me/${WHATSAPP_PHONE_E164.trim()}`
  : null;

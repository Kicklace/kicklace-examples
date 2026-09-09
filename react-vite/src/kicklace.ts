// The tag's own API, with types, and one rule about when it is there.
//
// The tag is loaded `async` from index.html, so `window.kl` appears a moment
// after the page does. Nothing here throws while it is missing: a call made
// too early waits for it, and one made on a page where the script never loaded
// at all answers instead of hanging.
//
// There is nothing to install for any of this. The tag is served by your own
// workspace with your settings inside it; the `kicklace` npm package is the
// other door, for a server holding a secret key.

/** What every call the tag answers resolves to. It never throws. */
export type Outcome = { ok: boolean; status: string };

type Consent = string | { text: string; granted_at?: string };

type Tag = {
  /** Any event: one of Kicklace's names, or one of your own. */
  track(type: string, options?: { properties?: Record<string, unknown> }): void;
  /** Stitch this browser to a person you already know. */
  identify(who: { email?: string; account_id?: string }): void;
  /** A form of your own: the address, the list, and the words they agreed to. */
  subscribe(options: {
    email: string;
    list: string;
    consent: Consent;
    hp?: string;
  }): Promise<Outcome>;
  /** Read one form element and send it, the way the tag does by itself. */
  capture(form: HTMLFormElement): Promise<Outcome>;
  /** This browser's id, so a visit and a purchase are one person. */
  id(): string;
  optOut(): void;
  optIn(): void;
};

declare global {
  interface Window {
    kl?: Tag;
  }
}

const WAIT_MS = 3000;
const EVERY_MS = 50;

/** The tag once it has loaded, or null if it never does. */
async function tag(): Promise<Tag | null> {
  if (typeof window === "undefined") return null;
  const until = Date.now() + WAIT_MS;
  while (!window.kl) {
    if (Date.now() > until) return null;
    await new Promise((done) => setTimeout(done, EVERY_MS));
  }
  return window.kl ?? null;
}

/**
 * Join a list. The consent text is the sentence the person actually read; it
 * is stored verbatim as the proof, with the day. Without one Kicklace refuses
 * the call, and it says so in `status`.
 */
export async function subscribe(options: {
  email: string;
  list: string;
  consent: Consent;
}): Promise<Outcome> {
  const kl = await tag();
  if (!kl) return { ok: false, status: "no_tag" };
  return kl.subscribe(options);
}

/** Record something that happened. Nothing to await: the tag posts and returns. */
export async function track(
  type: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const kl = await tag();
  kl?.track(type, properties ? { properties } : undefined);
}

/** Say who this browser is, once you know. */
export async function identify(who: {
  email?: string;
  account_id?: string;
}): Promise<void> {
  const kl = await tag();
  kl?.identify(who);
}

/** This browser's id, to send with a post your own server makes. */
export async function anonId(): Promise<string | undefined> {
  const kl = await tag();
  return kl?.id();
}

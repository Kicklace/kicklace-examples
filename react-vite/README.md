# A Vite React app

Kicklace is lifecycle email for SaaS founders: one map that follows every customer from sign-up to paying, with the emails for each stage on it, written in your own voice.
This example puts the tag in `index.html`, where it belongs in a single-page
app, calls `kl.subscribe` from a React form so the form can show its own state,
and records one event from a button.

```bash
npm install
npm run dev
```

## What to change

1. In `index.html`, replace `YOUR_PUBLIC_KEY` in the script tag with the public
   key from your workspace, under **Connections → Your website**. That screen
   shows the whole line with the key already in it. It is a public key: it can
   only add people, and it is meant to be in a page.
2. In `src/consent.ts`, set `LIST` to the address of one of your own lists
   (**Settings → Lists**) and `CONSENT` to whatever you really promise.
3. Add your site's address under **Connections → Your website → Where is your
   site?**, including `http://localhost:5173` while you are developing, or
   every post is refused — on purpose, so that nobody else's page can put
   people in your workspace.

No environment variables. The tag's address carries the public key, which is
how the script knows which workspace it belongs to, so there is nothing to
inject at build time.

The four names Kicklace's own tooling writes — `KICKLACE_SECRET_KEY` and
`KICKLACE_URL` for a server holding the secret key, `NEXT_PUBLIC_KICKLACE_KEY`
and `NEXT_PUBLIC_KICKLACE_URL` for `<KicklaceTag />` in a Next.js project,
which does the job `index.html` does here — belong to those two places. See the
`express` example next door, and the Next.js starter.

## Why the tag is in `index.html` and not in a component

Vite copies `index.html` through untouched, so the tag is in the page before
React starts and the first page read is not lost. A component that injected the
script would run after hydration, which is late, and would run again on every
navigation.

## The two ways to hook a form up

| | What you write | Where |
| --- | --- | --- |
| The attribute | `data-kl-list="product-updates"` and nothing else | `../plain-html` |
| The call | `kl.subscribe({ email, list, consent })` | `src/signup-form.tsx` |

The tag hears **every** submit on the capture phase, so a form marked with the
attribute works even inside React, without `preventDefault` being a problem.
Use one or the other: both would post the same signup twice. Kicklace is
idempotent on the pair (address, list) so nothing breaks, but there is no
reason to.

`kl.capture(form)` is the third door: hand it a form element and it reads the
address, the name and the ticked consent box off it, the way the attribute
path does, in one call you decide when to make.

## `src/kicklace.ts`

The tag is loaded `async`, so `window.kl` appears a moment after the page does.
That file is the typed wrapper: it waits for the tag, answers rather than hangs
if the script never loaded, and never throws.

Everything the tag can do:

```ts
kl.track("configure", { properties: { times: 2 } });
kl.identify({ email });                    // stitch this browser to a person
kl.subscribe({ email, list, consent });    // resolves { ok, status }
kl.capture(formElement);                   // read one form and send it
kl.id();                                   // this browser's id
kl.optOut(); kl.optIn();                   // remembered in localStorage
```

`kl.track` takes **Kicklace's own names only** — `pageview`, `configure`,
`cta_click`, `download`, `activated`, `signup`, `purchase`, `trial_started`,
`churned` and the rest, which `EventName` in `src/kicklace.ts` lists in full.
An event of your own goes through the server door instead (`POST
/api/v1/events`, or `track` from the `kicklace` package, as in `../express`),
because the public key is in the page and anybody could otherwise invent names
in your workspace. An unknown name here is refused as `unknown_event`.

## Consent

`CONSENT` in `src/consent.ts` is one constant, shown on the checkbox and sent
with the call, so what a person read and what Kicklace keeps as the proof are
the same sentence. Kicklace stores it verbatim with the day; a subscribe with
no consent is refused (`missing_consent`).

## A refusal is an answer

`kl.subscribe` resolves to `{ ok, status }` and never throws. `status` is
Kicklace's own code — `origin_not_allowed` while your site is not on the
workspace's list, `no_such_list` if the address is wrong — and the browser
console carries the whole sentence with the screen that fixes it.

MIT

# Kicklace examples

Kicklace is an AI-powered CRM and customer platform for micro SaaS companies:
one customer record from the first anonymous visit through the sign-up to the
subscription, with the email, the automations and the AI on top of it.

Three small, complete projects. Each one runs on its own, has nothing in it but
what it is showing, and is MIT.

| | What it shows | Install |
| --- | --- | --- |
| [`plain-html`](./plain-html) | The tag, and a form Kicklace hears with no JavaScript of yours | nothing |
| [`react-vite`](./react-vite) | The tag in a single-page app, and `kl.subscribe` from a React form | `npm install` |
| [`express`](./express) | `identify`, `subscribe` and `track` from a server, through the `kicklace` package | `npm install` |

## The two doors

There are only ever two, and most products want both.

**The tag** is one script in the `<head>` of your website. It records the page
reads, keeps one browser id so a visit last week and a sign-up today are one
person, remembers where somebody came from, and hears your own signup forms —
without taking any of them over. It is served by your workspace with your
settings already inside it, so there is nothing to install and nothing to keep
up to date. Your **public key** goes in its address, and is meant to be in a
page anybody can read.

**The package**, [`kicklace`](https://www.npmjs.com/package/kicklace), is one
line in your server: `identify`, `subscribe`, `track`, `support`, `batch` and
`messages`. Zero dependencies, nothing from `node:`, and every method resolves
to `{ ok: true, … }` or `{ ok: false, error, message }` — a refusal is an
answer, so nothing it does can throw inside your checkout. Your **secret key**
belongs here and nowhere else.

```bash
npm install kicklace
```

```ts
import { Kicklace } from "kicklace";

const kl = new Kicklace(process.env.KICKLACE_SECRET_KEY!);

await kl.track("purchase", { email, value: 49, idempotencyKey: invoice.id });
```

## Both keys are in one screen

**Settings → Your website** shows the tag with your public key already in it,
and **For your developers** at the bottom of the same screen mints a secret
key, which is shown once.

While you are trying an example, add its address — `http://localhost:5173` for
Vite, `http://localhost:3000` for the Express one — under **Settings → Your
website → Where is your site?**, or every post is refused. That is deliberate:
without it, anybody's page could put people in your workspace.

## Consent is not a setting

A subscription carries the words the person read, stored verbatim as the proof
with the day and, if you send it, their IP. There is no default sentence to
fall back on: a `subscribe` without one is refused. Every example keeps that
sentence as **one constant**, shown on the form and sent with the call, so what
a person agreed to and what Kicklace keeps cannot drift apart.

And Kicklace only emails somebody who has been in touch — who bought, signed
up, wrote in, replied, or joined a list. There is no switch that turns that
off.

## Somewhere else to start

- **A whole Next.js app, deployed in one click**:
  [kicklace-nextjs-starter](https://github.com/fallguy04/kicklace-nextjs-starter)
- **A Next.js project you already have**: `npx kicklace init` adds the tag, the
  dependency and the environment names, and prints every change first with
  `--dry-run`.
- **The docs**: <https://www.kicklace.com/docs>
- **The package's source**:
  [kicklace-js](https://github.com/fallguy04/kicklace-js)

MIT

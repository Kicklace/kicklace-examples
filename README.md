# Kicklace examples

Kicklace is lifecycle email for SaaS founders: one map that follows every customer from sign-up to paying, with the emails for each stage on it, written in your own voice. Connect your website and Stripe, and Kicklace reads your site and your payment history, places every customer on one map by what they have done, and writes the welcome, onboarding, trial-ending and failed-payment emails for you to read and switch on. It is free up to 1,000 contacts.

Kicklace does the follow-up a CRM is bought for, without the CRM. Instead of contacts, pipelines and campaigns on separate screens to learn, every customer and every email is on one map, made for founders who have never set up a CRM. How it compares with [Loops](https://www.kicklace.com/loops-alternative), [Customer.io](https://www.kicklace.com/customer-io-alternative) and [Mailchimp](https://www.kicklace.com/mailchimp-alternative-for-saas); its [MCP server](https://www.kicklace.com/docs/mcp) lets Claude and other AI assistants read and work in it.

Four small, complete projects. Each one runs on its own, has nothing in it but
what it is showing, and is MIT.

| | What it shows | Install |
| --- | --- | --- |
| [`plain-html`](./plain-html) | The tag, and a form Kicklace hears with no handler of yours | nothing |
| [`react-vite`](./react-vite) | The tag in a single-page app, and `kl.subscribe` from a React form | `npm install` |
| [`express`](./express) | `identify`, `subscribe` and `track` from a server, through the `kicklace` package | `npm install` |
| [`with-kicklace`](./with-kicklace) | The smallest Next.js app: the tag in the root layout, and one server-side event | `npm install` |

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

**Connections → Your website** shows the tag with your public key already in it,
and its **Developers** tab mints a secret key, which is shown once.

While you are trying one of the two **browser** examples, add its address —
`http://localhost:5173` for Vite, whatever port you serve the HTML page on —
under **Connections → Your website → Where is your site?**, or every post is
refused. That is deliberate: without it, anybody's page could put people in
your workspace. The Express example needs nothing of the sort: a post carrying
a secret key comes from a server, has no origin, and is never checked against
that list.

## Consent is not a setting

A subscription carries the words the person read, stored verbatim as the proof
with the day and, if you send it, their IP. There is no default sentence to
fall back on: a `subscribe` without one is refused.

Every example keeps that sentence in **one place**, so what a person agreed to
and what Kicklace keeps cannot drift apart: `plain-html` lets the tag read it
off the label of the ticked box, and the other two hold it as one constant that
the form shows and the call sends.

And Kicklace only emails somebody who has been in touch — who bought, signed
up, wrote in, replied, or joined a list. There is no switch that turns that
off.

## Somewhere else to start

- **A whole Next.js app, deployed in one click**:
  [kicklace-nextjs-starter](https://github.com/Kicklace/kicklace-nextjs-starter)
- **A Next.js project you already have**: `npx kicklace init` adds the tag, the
  dependency and the environment names, and prints every change first with
  `--dry-run`.
- **The docs**: <https://www.kicklace.com/docs>
- **The package's source**:
  [kicklace-js](https://github.com/Kicklace/kicklace-js)

MIT

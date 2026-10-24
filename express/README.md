# An Express server

Kicklace is lifecycle email for SaaS founders: it follows every customer from sign-up to paying and writes the emails along the way in your own voice.
This example is the server side of it: one client, three calls, and a refusal
that comes back as data rather than an exception.

```bash
npm install
cp .env.example .env     # then fill in your secret key
npm start
```

Node 20.18 or newer, because `npm start` reads `.env` with Node's own
`--env-file-if-exists` and there is no dotenv package here. The `kicklace`
package itself needs Node 18, has no dependencies and imports nothing from
`node:`, so it runs the same on Node, Bun, Deno, an edge runtime and in a
worker.

## What to change

1. Put your secret key in `.env`. It is under **Connections → Your website → For
   your developers**, and it is shown once. It is a server key: it must never
   be in a page or in a repository.
2. In `consent.js`, set `LIST` to the address of one of your own lists
   (**Settings → Lists**) and `CONSENT` to whatever your form really says.

## Try it

```bash
curl -X POST localhost:3000/api/signup \
  -H 'content-type: application/json' \
  -d '{"email":"someone@example.com","name":"Someone"}'

curl -X POST localhost:3000/api/purchase \
  -H 'content-type: application/json' \
  -d '{"email":"someone@example.com","amount":49,"invoiceId":"in_123"}'
```

Then open the person in Kicklace: they are on the list with the sentence they
agreed to stored word for word, the sign-up moved them to the Account stage and
the purchase moved them to Paying.

## The three calls

| Call | What it is for |
| --- | --- |
| `identify` | Who somebody is, and the browser your tag has been watching |
| `subscribe` | A list, and the words they agreed to, stored verbatim |
| `track` | What happened — a sign-up, a purchase, an event of your own |

`kl.batch([…])` sends up to a hundred of them in one request, and
`kl.support`, `kl.messages.send`, `kl.messages.list` and `kl.messages.thread`
are the rest of the package.

`anonId` is the browser id the tag keeps in `localStorage` as `kl_id`. Send it
from your page (`kl.id()`) with the sign-up and the anonymous visits Kicklace
already has and this person become one record. Leave it out and the sign-up
starts a new one.

## Payments

**You may not need `/api/purchase` at all.** Kicklace takes Stripe's webhook
itself: Connections → Stripe gives you an address to
paste into your Stripe dashboard, and from then on a paid invoice is a purchase
with its amount on the person's timeline and the lifecycle moves them to
Paying — with no code, no deployment, and no signing secret in your project.
Prefer that.

Keep a route like this one when the payment is not the whole story: when you
want to look something up in your own database first, post an event of your own
beside the purchase, or send Kicklace only some of what your provider tells
you. Run one of them, never both, or the purchase lands twice.

`idempotencyKey` is what makes a retry safe. Give it the invoice's own id and
the same payment lands once however many times your provider knocks.

## A refusal is an answer

Every method resolves to one of two shapes, and nothing throws inside your
checkout:

```js
{ ok: true,  status: "recorded", id: "…" }
{ ok: false, error: "not_engaged", message: "…", httpStatus: 403 }
```

`error` is Kicklace's own code and `message` is its own sentence, handed on
untouched, because the fix is usually inside it. A network failure that
survived the retries is `{ ok: false, error: "unreachable", httpStatus: 0 }`.
A 5xx and a network failure are tried again; a 4xx never is, because a refusal
is an answer and asking twice will not change it.

The only exceptions are thrown when you build the client, and only for the two
mistakes worth stopping a program for: no key at all, and a key of the wrong
kind. A public key (`wk_…`) passed here is refused by name, because it belongs
in the tag.

## Consent, and who may be emailed

Two rules travel with the package because they are the product, not settings.

- **A subscription needs the words the person agreed to.** They are stored
  verbatim as the proof, with the day. Without them the call is refused
  (`missing_consent`).
- **Kicklace emails a person who has been in touch**: somebody who bought,
  signed up, wrote in, replied, or joined a list. Anybody else is
  `not_engaged`, and there is no switch that turns that off.

## The other half

The traffic side is the tag on your website — page reads, where somebody came
from, and the signup forms it can hear. See `../plain-html` and
`../react-vite`, or <https://www.kicklace.com/docs/site-platforms>.

MIT

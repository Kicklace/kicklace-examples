# with-kicklace

Kicklace is an AI-powered CRM and customer platform for micro SaaS companies. One customer record
from the first anonymous visit through the sign-up to the subscription, with the lifecycle,
automations and AI on top of it. This example is the smallest way to see it work — two things
wired in, nothing else:

- **The tag**, in `app/layout.tsx` — every read of this page is already on its way to Kicklace.
- **One event**, posted from `app/api/signup/route.ts` — a person signing up, told to Kicklace with
  the [`kicklace`](https://www.npmjs.com/package/kicklace) package.

## How to use

```bash
npx create-next-app --example with-kicklace with-kicklace-app
cd with-kicklace-app
```

Or clone this repository and run it from `examples/with-kicklace`.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Both keys — a public one for the tag, a secret one for the server — are under **Connections → Your
website → For your developers** in a Kicklace workspace, minted the moment you sign up. Fill both
into `.env.local`.

Open [http://localhost:3000](http://localhost:3000), submit the form, and look at the workspace: a
person is there, on Signed up.

While developing, add `http://localhost:3000` under **Connections → Your website → Where is your
site?**, or the tag's own posts are refused — a page nobody has allowed cannot add people to a
workspace it does not own.

## What each file does

| File | What it shows |
| --- | --- |
| `app/layout.tsx` | `<KicklaceTag />` from `kicklace/next` — page reads, where a visitor came from, no cookies |
| `app/api/signup/route.ts` | `kl.track("signup", { email })` — the one event, moving the person to Signed up |
| `app/signup-form.tsx` | The client half: posts to the route above and shows what came back |

## Adding this to a project you already have

```bash
npx kicklace init
```

Adds the tag to your root layout, `kicklace` to `package.json`, and the four environment names to
`.env.example` — nothing more, and nothing it does not print first with `npx kicklace init
--dry-run`.

## More

- **A whole app, deployed in one click**:
  [kicklace-nextjs-starter](https://github.com/Kicklace/kicklace-nextjs-starter) — the tag, a
  sign-up handler and a Stripe webhook
- **Every event, every method**: [kicklace-js](https://github.com/Kicklace/kicklace-js)
- **The docs**: <https://www.kicklace.com/docs>

MIT

// An Express server that talks to Kicklace.
//
// Three calls, which between them are most of what a server ever needs:
//
//   identify   who somebody is, and the browser your tag has been watching, so
//              the visitor who read the pricing page last week and the person
//              signing up now are one record rather than two.
//   subscribe  the list, and the words they agreed to, stored verbatim as the
//              proof. Without them Kicklace refuses the call.
//   track      what happened — a sign-up, a purchase, an event of your own.
//
// None of them throws. A refusal comes back as `{ ok: false, error, message }`
// with Kicklace's own sentence in it, which is what these routes hand on.
import express from "express";
import { CONSENT, LIST } from "./consent.js";
import { NO_KEY, kicklace } from "./kicklace.js";

const app = express();
app.use(express.json());

app.get("/", (_request, response) => {
  response.type("text/plain").send(
    [
      "Kicklace + Express example.",
      "",
      "  POST /api/signup    { email, name?, anonId? }",
      "  POST /api/purchase  { email, amount, invoiceId }",
      "",
      process.env.KICKLACE_SECRET_KEY
        ? "KICKLACE_SECRET_KEY is set."
        : NO_KEY,
      "",
    ].join("\n"),
  );
});

// ---------------------------------------------------------------------------
// Somebody signed up.
//
// `anonId` is the browser id the tag keeps in localStorage as `kl_id`. Send it
// from your page (`kl.id()`) and the anonymous visits Kicklace already has and
// this person become one record. Leave it out and the signup simply starts a
// new one.
// ---------------------------------------------------------------------------
app.post("/api/signup", async (request, response) => {
  const { email, name, anonId } = request.body ?? {};
  if (typeof email !== "string" || !email.includes("@"))
    return response
      .status(400)
      .json({ ok: false, message: "That does not look like an email address." });

  const kl = kicklace();
  if (!kl) return response.status(500).json({ ok: false, message: NO_KEY });

  await kl.identify({ email, name, anonId });

  // The lifecycle: this is what moves them to the Account stage.
  await kl.track("signup", { email, anonId });

  const joined = await kl.subscribe({
    email,
    list: LIST,
    // The same constant your form showed them. Kicklace keeps it word for word.
    consent: CONSENT,
    anonId,
    sourceLabel: "the sign-up form",
  });

  if (!joined.ok)
    return response
      .status(joined.httpStatus === 0 ? 502 : joined.httpStatus)
      .json({ ok: false, error: joined.error, message: joined.message });

  // `subscribed` and `already_subscribed` mean the same thing to whoever filled
  // the form in, and Kicklace answers the two the same way on purpose.
  return response.json({ ok: true, status: joined.status });
});

// ---------------------------------------------------------------------------
// Somebody paid.
//
// You may not need this route at all. Kicklace takes Stripe's webhook itself:
// Connections → Stripe gives you an address to paste
// into your Stripe dashboard, and from then on a paid invoice is a purchase
// with its amount on the person's timeline and the lifecycle moves them to
// Paying — with no code, no deployment, and no signing secret in your
// project. Prefer that.
//
// Keep a route like this when the payment is not the whole story: when you
// want to look something up in your own database first, post an event of your
// own beside the purchase, or send Kicklace only some of what your payment
// provider tells you. Run one of them, never both, or the purchase lands
// twice.
//
// `idempotencyKey` is what makes a retry safe. Give it the invoice's own id
// and the same payment lands once however many times your provider knocks.
// ---------------------------------------------------------------------------
app.post("/api/purchase", async (request, response) => {
  const { email, amount, invoiceId } = request.body ?? {};
  if (typeof email !== "string" || !email.includes("@"))
    return response
      .status(400)
      .json({ ok: false, message: "That does not look like an email address." });

  const kl = kicklace();
  if (!kl) return response.status(500).json({ ok: false, message: NO_KEY });

  const recorded = await kl.track("purchase", {
    email,
    value: Number(amount) || 0, // whole currency units: 49, not 4900
    idempotencyKey: typeof invoiceId === "string" ? invoiceId : undefined,
  });

  if (!recorded.ok)
    return response
      .status(recorded.httpStatus === 0 ? 502 : recorded.httpStatus)
      .json({ ok: false, error: recorded.error, message: recorded.message });

  return response.json({ ok: true, id: recorded.id });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

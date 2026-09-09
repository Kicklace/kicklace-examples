// A React form that posts the signup itself.
//
// Two ways to hook a form up, and you want one of them:
//
//   1. Mark the form data-kl-list="product-updates" and write nothing. The tag
//      hears the submit on its way past and reads the address and the ticked
//      consent box off the form. That is templates/examples/plain-html.
//   2. Call kl.subscribe yourself, which is this file, because a React form
//      usually wants to show its own state anyway.
//
// Doing both posts the same signup twice. Kicklace is idempotent on the pair
// (address, list) so nothing breaks, but there is no reason to.
import { useState } from "react";
import { CONSENT, LIST } from "./consent";
import { subscribe } from "./kicklace";

type State =
  | { kind: "idle" | "sending" }
  | { kind: "done" }
  | { kind: "problem"; status: string };

export function SignupForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    setState({ kind: "sending" });

    // The sentence sent is the same constant the label below shows.
    const joined = await subscribe({ email, list: LIST, consent: CONSENT });

    // A refusal is an answer, never a throw. `status` is Kicklace's own code —
    // origin_not_allowed while your site is not on the workspace's list,
    // no_such_list if the address is wrong — and the browser console carries
    // the whole sentence.
    if (joined.ok) setState({ kind: "done" });
    else setState({ kind: "problem", status: joined.status });
  }

  if (state.kind === "done")
    return (
      <p className="said">
        You are on the list. Unsubscribe with one click whenever you like.
      </p>
    );

  return (
    <form onSubmit={onSubmit}>
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>

      <p className="consent">
        <input type="checkbox" id="consent" required />
        <label htmlFor="consent">{CONSENT}</label>
      </p>

      <button type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Joining…" : "Join"}
      </button>

      {state.kind === "problem" && (
        <p className="said">
          That did not work: <code>{state.status}</code>. The browser console
          says why in one sentence.
        </p>
      )}
    </form>
  );
}

import { useState } from "react";
import { SignupForm } from "./signup-form";
import { track } from "./kicklace";

export function App() {
  const [tries, setTries] = useState(0);

  // `configure` is Kicklace's own name for "tried the in-browser demo". It
  // lands on the person's timeline with whatever properties you send and an
  // automation can answer it; it moves nobody between stages.
  //
  // The tag posts Kicklace's own names only — pageview, configure, cta_click,
  // download, activated, signup, purchase, trial_started, churned and the
  // rest. A name of your own goes through the server door instead
  // (`POST /api/v1/events`, or the `kicklace` package's own `track`), because
  // the public key is in the page and anybody could otherwise invent names in
  // your workspace. An unknown name here is refused as `unknown_event`.
  function onTry() {
    const next = tries + 1;
    setTries(next);
    void track("configure", { times: next });
  }

  return (
    <main>
      <h1>Widgets for people who like widgets</h1>
      <p>
        A Vite React app with the Kicklace tag in <code>index.html</code>, a
        signup form that calls <code>kl.subscribe</code>, and one button that
        records an event.
      </p>

      <p>
        <button type="button" onClick={onTry}>
          Try the demo
        </button>{" "}
        {tries > 0 && (
          <small>
            Sent <code>configure</code> {tries} {tries === 1 ? "time" : "times"}.
          </small>
        )}
      </p>

      <SignupForm />

      <p>
        <small>
          The tag also records the page read by itself, and where this visit
          came from. Open the browser console: a refused post says why, in one
          sentence.
        </small>
      </p>
    </main>
  );
}

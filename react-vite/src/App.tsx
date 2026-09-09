import { useState } from "react";
import { SignupForm } from "./signup-form";
import { track } from "./kicklace";

export function App() {
  const [tries, setTries] = useState(0);

  // An event of your own: 2 to 40 characters of lowercase letters, digits and
  // underscores. It lands on the person's timeline and an automation can
  // answer it. It moves nobody between stages, because Kicklace cannot know
  // what a name it has never seen means. `configure`, `cta_click` and
  // `download` are Kicklace's own names and behave the same way.
  function onTry() {
    const next = tries + 1;
    setTries(next);
    void track("demo_opened", { times: next });
  }

  return (
    <main>
      <h1>Widgets for people who like widgets</h1>
      <p>
        A Vite React app with the Kicklace tag in <code>index.html</code>, a
        signup form that calls <code>kl.subscribe</code>, and one button that
        records an event of its own.
      </p>

      <p>
        <button type="button" onClick={onTry}>
          Try the demo
        </button>{" "}
        {tries > 0 && (
          <small>
            Sent <code>demo_opened</code> {tries} {tries === 1 ? "time" : "times"}.
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

import { SignupForm } from "./signup-form";

export default function Home() {
  return (
    <main>
      <h1>with-kicklace</h1>
      <p>
        Two things are wired in: the tag in <code>app/layout.tsx</code> — every read of this
        page is already on its way to Kicklace — and one server-side event, posted from{" "}
        <code>app/api/signup/route.ts</code> when the form below is submitted.
      </p>
      <SignupForm />
      <p>
        Set the four names in <code>.env.example</code> as <code>.env.local</code> first — the two
        keys are under Connections → Your website → For your developers in a Kicklace workspace.
      </p>
    </main>
  );
}

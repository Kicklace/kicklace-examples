"use client";

import { useState } from "react";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [said, setSaid] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = (await res.json()) as { ok: boolean; message?: string };
    setSaid(body.ok ? "Sent — check the workspace." : (body.message ?? "Kicklace refused that."));
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button type="submit" disabled={busy}>
        {busy ? "Sending…" : "Sign up"}
      </button>
      {said && <p>{said}</p>}
    </form>
  );
}

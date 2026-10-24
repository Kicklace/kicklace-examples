// One Kicklace client for this server.
//
// It is built when it is first asked for rather than at import time, because
// the constructor throws when there is no key — the only thing the package
// ever throws for — and a server deployed before its key is set should still
// start and still serve. Nothing here ever reaches a browser: this module
// holds the secret key.
import { Kicklace } from "kicklace";

let client = null;

/** The client, or null when KICKLACE_SECRET_KEY is not set. */
export function kicklace() {
  if (client) return client;
  const key = process.env.KICKLACE_SECRET_KEY;
  if (!key) return null;
  client = new Kicklace({
    key,
    // https://www.kicklace.com unless you run your own deployment.
    url: process.env.KICKLACE_URL,
  });
  return client;
}

export const NO_KEY =
  "KICKLACE_SECRET_KEY is not set, so nothing was sent to Kicklace. It is under Connections → Your website → Developers, where it is shown once.";

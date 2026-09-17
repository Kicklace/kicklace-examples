// The one event: a person signed up, told to Kicklace from the server.
// `kl.track("signup", …)` moves them to Signed up on the lifecycle; nothing
// here can throw, even when Kicklace refuses the request — a refusal is an
// answer, `{ ok: false, error, message }`, and this route just forwards it.
import { Kicklace } from "kicklace";

export async function POST(request: Request) {
  const key = process.env.KICKLACE_SECRET_KEY;
  if (!key) {
    return Response.json(
      { ok: false, message: "KICKLACE_SECRET_KEY is not set." },
      { status: 500 },
    );
  }

  const { email } = (await request.json()) as { email?: string };
  if (!email) {
    return Response.json({ ok: false, message: "An email is required." }, { status: 400 });
  }

  const kl = new Kicklace({ key, url: process.env.KICKLACE_URL });
  const result = await kl.track("signup", { email });
  return Response.json(result, { status: result.ok ? 200 : result.httpStatus || 400 });
}

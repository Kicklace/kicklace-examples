import type { Metadata } from "next";
import { KicklaceTag } from "kicklace/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "with-kicklace",
  description: "The smallest Next.js app wired to Kicklace: the tag, and one server-side event.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Page reads, where somebody came from, and the sign-up form below —
            heard because it is marked data-kl-list, with no handler of ours.
            Reads NEXT_PUBLIC_KICKLACE_KEY and NEXT_PUBLIC_KICKLACE_URL, and
            renders nothing (saying why in the console) with no key set. */}
        <KicklaceTag />
      </body>
    </html>
  );
}

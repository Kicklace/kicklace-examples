import type { NextConfig } from "next";

// Turbopack finds its project root by walking up for the nearest lockfile;
// nested here inside Kicklace's own monorepo for development, that walk can
// reach past this folder's own package-lock.json to the outer repository's
// and pull in its src/proxy.ts. Pinning the root here is what the example
// itself needs regardless — once this folder is the root of its own
// repository (kicklace-examples, via scripts/public-repos.sh), it is already
// pointing at itself.
const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;

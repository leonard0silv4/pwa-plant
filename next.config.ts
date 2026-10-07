import type { NextConfig } from "next";
import { randomUUID } from "node:crypto";
import withSerwistInit from "@serwist/next";

// Changes on every build so precached HTML shells are refreshed.
const revision = randomUUID();

// Serwist is disabled in dev (Turbopack); silence its warning there.
process.env.SERWIST_SUPPRESS_TURBOPACK_WARNING ??= "1";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === "development",
  // Pre-cache the app shell so history and saved analyses open offline.
  additionalPrecacheEntries: [
    { url: "/", revision },
    { url: "/history", revision },
    { url: "/about", revision },
    { url: "/analysis", revision },
    { url: "/offline", revision },
  ],
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Shown on /about so a deploy can be confirmed from the phone.
  env: {
    NEXT_PUBLIC_BUILD: `${(process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7)} · ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`,
  },
  // Dev runs on Turbopack (Serwist disabled); production builds use webpack.
  turbopack: {},
};

export default withSerwist(nextConfig);

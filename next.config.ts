import type { NextConfig } from "next";

const adminSlug = process.env.ADMIN_SLUG?.trim();

const nextConfig: NextConfig = {
  async headers() {
    if (!adminSlug) return [];
    // L'admin ne doit jamais être indexé, quel que soit le client.
    return [
      {
        source: `/${adminSlug}/:path*`,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: `/${adminSlug}`,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;

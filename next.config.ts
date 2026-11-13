// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Blog posts are read from disk whenever a page revalidates (hourly), which
  // is how a post releases on its date without a deploy. Every route renders
  // the header and footer, and those read the blog files to decide whether
  // to show the Blog link, so the files ship with every route's function.
  outputFileTracingIncludes: {
    "/*": ["./content/blog/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/fortwaynedirectprimarycare.sigmamd.com/signup/memberships",
        destination:
          "https://fortwaynedirectprimarycare.sigmamd.com/signup/memberships",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

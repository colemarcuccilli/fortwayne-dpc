// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

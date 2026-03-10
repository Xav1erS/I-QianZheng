/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://iqianzheng.com/:path*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;

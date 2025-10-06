/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Handle React Router paths
      {
        source: '/(shop|dealers|dealer/:path*)',
        destination: '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

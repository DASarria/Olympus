/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://9eaizp3wsf.execute-api.us-east-1.amazonaws.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
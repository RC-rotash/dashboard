// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.16:8083/v1/analysis/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
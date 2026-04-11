// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://ec2-13-203-195-172.ap-south-1.compute.amazonaws.com/v1/analysis/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
// // next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://ec2-13-203-195-172.ap-south-1.compute.amazonaws.com/v1/analysis/:path*',
//       },
//     ];
//   },
//   output: 'export',  
//   images: {
//     unoptimized: true,
//   },
// };

// module.exports = nextConfig;


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
  output: 'standalone',  // ✅ Change 'export' to 'standalone'
  // images: { unoptimized: true }  // standalone mein iski zaroorat nahi
};

module.exports = nextConfig;
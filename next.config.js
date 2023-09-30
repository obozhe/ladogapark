/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    legacyBrowsers: false,
    serverActions: true,
  },
  rewrites() {
    console.log(process.env.NEXT_PUBLIC_CRM_URL, 'rewrites')
    return [{ source: '/api/bookings', destination: process.env.NEXT_PUBLIC_CRM_URL }];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: '/management',
        destination: '/management/objects',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ladogapark-crm-production.up.railway.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;

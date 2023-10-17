/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    legacyBrowsers: false,
    serverActions: true,
  },
  rewrites() {
    return [{ source: '/api/:path*', destination: `${process.env.NEXT_PUBLIC_CRM_URL}/api/:path*` }];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    legacyBrowsers: false,
    serverActions: true,
  },
  rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:5050', basePath: false }];
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

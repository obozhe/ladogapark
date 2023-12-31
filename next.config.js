/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    console.log(process.env.NEXT_PUBLIC_CRM_URL, 'next public crm url')
    return [
      { source: '/api/:path*', destination: `${process.env.NEXT_PUBLIC_CRM_URL}/api/:path*` },
      { source: '/v3/:path*', destination: 'https://api.yookassa.ru/v3/:path*' },
    ];
  },
  experimental: {
    ppr: true,
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
        pathname: '/uploads/public/**',
      },
    ],
  },
};

module.exports = nextConfig;

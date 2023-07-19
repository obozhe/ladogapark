/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;

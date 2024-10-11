
// const nextConfig = {}

// module.exports = nextConfig
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'solid-art.053ca5257bb631c29c0560a2e8f831be.r2.cloudflarestorage.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pub-f789d008c99e4fccaba120ca489c05ae.r2.dev',
        port: '',
        pathname: '**',
      },
      ],
  },
}
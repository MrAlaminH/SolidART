
// const nextConfig = {}

// module.exports = nextConfig
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '**',
      },
    ],
  },
}
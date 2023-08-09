/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: false,
  experimental: {
    // Defaults to 50MB
    isrMemoryCacheSize: 0,
  },
  output: 'standalone',
}

module.exports = nextConfig

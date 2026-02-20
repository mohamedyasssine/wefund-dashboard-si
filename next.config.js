/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Pendant le développement, on peut être plus permissif
    ignoreBuildErrors: false,
  },
  eslint: {
    // Pendant le développement, on peut être plus permissif
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig

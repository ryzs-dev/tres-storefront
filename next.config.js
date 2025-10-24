const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compiler: {
    reactRemoveProperties: false,
  },
  experimental: {
    reactCompilerHydrationWarnings: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.tres.my",
      },
      {
        protocol: "https",
        hostname: "4a19fb4b801f6cdb643d9e49840bf0d8.r2.cloudflarestorage.com", // fallback R2 bucket URL
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
    ],
  },
}

module.exports = nextConfig

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// })

// module.exports = withBundleAnalyzer({
//   reactStrictMode: true,
// })

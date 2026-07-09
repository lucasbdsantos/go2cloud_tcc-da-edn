/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Required by ./Dockerfile (production): without this, `next build` never
  // generates .next/standalone, and the Docker image build fails at the
  // `COPY --from=builder /app/.next/standalone` step.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

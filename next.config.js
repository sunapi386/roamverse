/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // old workspace root has Chakra UI types that fail with TS5
    ignoreBuildErrors: true,
  },
}
module.exports = nextConfig

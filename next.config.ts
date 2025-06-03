/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  output: "standalone",
  distDir: ".next",
  typescript: {
    ignoreBuildErrors: true
  }
};
export default nextConfig;
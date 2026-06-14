/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/1', destination: '/tutoriels/1', permanent: true },
      { source: '/2', destination: '/tutoriels/2', permanent: true },
      { source: '/3', destination: '/tutoriels/3', permanent: true },
    ]
  },
}

export default nextConfig

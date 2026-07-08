/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    // Set root to this project so Next.js doesn't pick up parent lockfiles
    root: import.meta.dirname,
  },
};

export default nextConfig;

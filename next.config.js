/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Phaser needs canvas, skip SSR prerender for game page
  output: undefined,
};

module.exports = nextConfig;

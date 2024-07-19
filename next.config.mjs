/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // for client side
  env: { AES_ENCRYPT_KEY: process.env.AES_ENCRYPT_KEY },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // for client side
  env: { AES_ENCRYPT_KEY: process.env.AES_ENCRYPT_KEY, ARTICLE_TAG_MAX_COUNT: process.env.ARTICLE_TAG_MAX_COUNT },
}

export default nextConfig

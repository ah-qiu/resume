/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false, // enable browser source map generation during the production build
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    // appDir: true,
  },
  // fix all before production. Now it slow the develop speed.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    ignoreBuildErrors: true,
  },
  // GitHub Pages 配置
  // 如果是项目页面（如 username/repo-name），basePath 应为 '/repo-name'
  // 如果是用户/组织页面（username.github.io），basePath 应为 ''
  basePath: process.env.NODE_ENV === 'production' ? '/resume' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/resume' : '',
  // 启用静态导出以支持 GitHub Pages
  output: 'export',
  // 禁用图片优化（静态导出需要）
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

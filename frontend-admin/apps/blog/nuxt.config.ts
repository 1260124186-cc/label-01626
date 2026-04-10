// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@vueuse/nuxt', '@nuxt/eslint'],

  // Nuxt 4 保持 v3 目录结构（不使用 app/ 目录）
  srcDir: '.',
  dir: {
    app: 'app',
  },

  // 完全禁用 @nuxt/fonts 模块，使用系统字体
  fonts: false,

  // 禁用颜色模式切换，只使用亮色模式
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
    dataValue: 'light',
  },

  css: ['~/assets/css/main.css'],

  // 运行时配置 - 支持环境变量
  runtimeConfig: {
    // 私有配置 (仅服务端可用)
    jwtSecret: 'default-secret',

    // 公开配置 (客户端可用)
    public: {
      siteUrl: 'http://localhost:8081',
      apiBaseUrl: '/api',
      siteTitle: 'TechBlog',
      siteDescription: '一个现代化的技术博客平台',
    },
  },

  vite: {
    plugins: [],
    server: {
      proxy: {
        // 代理 /admin 到 admin 应用（开发模式）
        '/admin': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
      },
    },
  },

  app: {
    head: {
      title: 'TechBlog - 技术博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '一个现代化的技术博客平台，分享前端、后端、DevOps 等技术文章',
        },
        { name: 'keywords', content: '博客,技术,前端,后端,Vue,Nuxt,TypeScript' },
        { property: 'og:title', content: 'TechBlog - 技术博客' },
        { property: 'og:description', content: '一个现代化的技术博客平台' },
        { property: 'og:type', content: 'website' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  nitro: {
    preset: 'node-server',
    routeRules: {
      // 首页预渲染
      '/': { prerender: true },
      // 关于页面预渲染
      '/about': { prerender: true },
      // API 路由
      '/api/**': { cors: true },
    },
  },

  compatibilityDate: '2025-01-01',

  typescript: {
    strict: true,
    typeCheck: false, // 禁用构建时类型检查，避免配置类型问题
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})

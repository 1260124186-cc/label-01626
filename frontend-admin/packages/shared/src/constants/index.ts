// 站点配置常量
export const SITE_CONFIG = {
  title: 'TechBlog',
  description: '一个现代化的技术博客平台',
  author: 'Blog Team',
  keywords: ['博客', '技术', '前端', '开发'],
} as const

// API 配置
export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 10000,
} as const

// 分页默认值
export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 10,
  maxPageSize: 100,
} as const

// 文章状态映射
export const POST_STATUS_MAP = {
  draft: { label: '草稿', color: 'gray' },
  published: { label: '已发布', color: 'green' },
  archived: { label: '已归档', color: 'orange' },
} as const

// 用户角色映射
export const USER_ROLE_MAP = {
  admin: { label: '管理员', color: 'red' },
  editor: { label: '编辑', color: 'blue' },
  author: { label: '作者', color: 'green' },
  reader: { label: '读者', color: 'gray' },
} as const

// 评论状态映射
export const COMMENT_STATUS_MAP = {
  pending: { label: '待审核', color: 'yellow' },
  approved: { label: '已通过', color: 'green' },
  spam: { label: '垃圾评论', color: 'red' },
  trash: { label: '已删除', color: 'gray' },
} as const

// 设计系统间距
export const SPACING = {
  'xs': '4px',
  'sm': '8px',
  'md': '16px',
  'lg': '24px',
  'xl': '32px',
  '2xl': '48px',
} as const

// 颜色主题
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const

// 本地存储键
export const STORAGE_KEYS = {
  token: 'blog_token',
  user: 'blog_user',
  theme: 'blog_theme',
  locale: 'blog_locale',
} as const

// 路由路径
export const ROUTES = {
  // 博客主站
  blog: {
    home: '/',
    posts: '/posts',
    post: (slug: string) => `/posts/${slug}`,
    categories: '/categories',
    category: (slug: string) => `/categories/${slug}`,
    tags: '/tags',
    tag: (slug: string) => `/tags/${slug}`,
    about: '/about',
    search: '/search',
  },
  // 管理后台
  admin: {
    login: '/login',
    dashboard: '/',
    posts: '/posts',
    postCreate: '/posts/create',
    postEdit: (id: string) => `/posts/${id}/edit`,
    categories: '/categories',
    tags: '/tags',
    comments: '/comments',
    users: '/users',
    settings: '/settings',
  },
} as const

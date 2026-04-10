/**
 * 文章数据存储
 * 使用 localStorage 持久化存储，支持浏览器刷新后保留数据
 */

import type { Post } from '../types'

const STORAGE_KEY = 'techblog_posts'

// 默认的 mock 文章数据
const defaultPosts: Post[] = [
  {
    id: '1',
    title: 'Vue 3 组合式 API 完全指南',
    slug: 'vue-3-composition-api-guide',
    excerpt:
      '深入了解 Vue 3 的组合式 API，包括 setup、ref、reactive、computed 等核心概念，以及如何在实际项目中应用。',
    content: `# Vue 3 组合式 API 完全指南

## 简介

Vue 3 引入了组合式 API（Composition API），这是一种全新的组织组件逻辑的方式。相比于选项式 API，组合式 API 提供了更好的代码组织和逻辑复用能力。

## 核心概念

### setup 函数

\`setup\` 是组合式 API 的入口点，在组件创建之前执行。

\`\`\`javascript
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return { count }
  }
}
\`\`\`

### ref 和 reactive

- \`ref\` 用于创建基本类型的响应式数据
- \`reactive\` 用于创建对象类型的响应式数据

## 总结

组合式 API 让我们能够更灵活地组织代码，提高代码的可维护性和复用性。`,
    coverImage: '/img/vue3.webp',
    author: {
      id: '1',
      name: '技术博主',
      email: 'author@techblog.com',
      avatar: 'https://picsum.photos/seed/author1/100/100',
      role: 'admin',
    },
    category: { id: '1', name: '前端开发', slug: 'frontend', postCount: 10 },
    tags: [
      { id: '1', name: 'Vue', slug: 'vue', postCount: 5 },
      { id: '2', name: 'JavaScript', slug: 'javascript', postCount: 8 },
    ],
    viewCount: 1256,
    likeCount: 89,
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'TypeScript 入门到精通',
    slug: 'typescript-from-beginner-to-master',
    excerpt:
      '从零开始学习 TypeScript，掌握类型系统、接口、泛型等核心特性，提升代码质量和开发效率。',
    content: `# TypeScript 入门到精通

## 为什么选择 TypeScript

TypeScript 是 JavaScript 的超集，添加了静态类型检查。它可以帮助我们：

- 在编译时发现错误
- 提供更好的 IDE 支持
- 提高代码可维护性

## 基础类型

\`\`\`typescript
// 基本类型
let name: string = 'TypeScript'
let age: number = 10
let isActive: boolean = true

// 数组
let numbers: number[] = [1, 2, 3]
\`\`\`

## 总结

TypeScript 是现代前端开发的必备技能，值得投入时间学习。`,
    coverImage: '/img/ts.webp',
    author: {
      id: '1',
      name: '技术博主',
      email: 'author@techblog.com',
      avatar: 'https://picsum.photos/seed/author1/100/100',
      role: 'admin',
    },
    category: { id: '1', name: '前端开发', slug: 'frontend', postCount: 10 },
    tags: [
      { id: '3', name: 'TypeScript', slug: 'typescript', postCount: 6 },
      { id: '2', name: 'JavaScript', slug: 'javascript', postCount: 8 },
    ],
    viewCount: 892,
    likeCount: 67,
    status: 'published',
    publishedAt: '2024-01-12T14:00:00Z',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z',
  },
  {
    id: '3',
    title: 'Tailwind CSS 实战技巧',
    slug: 'tailwind-css-practical-tips',
    excerpt: '分享 Tailwind CSS 的实用技巧和最佳实践，帮助你快速构建美观的用户界面。',
    content: `# Tailwind CSS 实战技巧

## 什么是 Tailwind CSS

Tailwind CSS 是一个功能类优先的 CSS 框架，它提供了大量的原子类，让你可以直接在 HTML 中构建设计。

## 核心概念

### 响应式设计

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 内容 -->
</div>
\`\`\`

### 暗色模式

\`\`\`html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <!-- 内容 -->
</div>
\`\`\`

## 总结

Tailwind CSS 让 CSS 开发变得更加高效和愉快。`,
    coverImage: '/img/css.webp',
    author: {
      id: '1',
      name: '技术博主',
      email: 'author@techblog.com',
      avatar: 'https://picsum.photos/seed/author1/100/100',
      role: 'admin',
    },
    category: { id: '1', name: '前端开发', slug: 'frontend', postCount: 10 },
    tags: [
      { id: '4', name: 'CSS', slug: 'css', postCount: 4 },
      { id: '5', name: 'Tailwind', slug: 'tailwind', postCount: 3 },
    ],
    viewCount: 654,
    likeCount: 45,
    status: 'published',
    publishedAt: '2024-01-10T16:00:00Z',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z',
  },
]

/**
 * 检查是否在浏览器环境
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * 从 localStorage 加载文章数据
 */
function loadPostsFromStorage(): Post[] {
  if (!isBrowser()) {
    return [...defaultPosts]
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  }
  catch (e) {
    console.warn('Failed to load posts from localStorage:', e)
  }

  // 首次加载时，保存默认数据到 localStorage
  savePostsToStorage(defaultPosts)
  return [...defaultPosts]
}

/**
 * 保存文章数据到 localStorage
 */
function savePostsToStorage(posts: Post[]): void {
  if (!isBrowser())
    return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }
  catch (e) {
    console.warn('Failed to save posts to localStorage:', e)
  }
}

// 内存中的文章数据（从 localStorage 初始化）
let postsCache: Post[] | null = null

/**
 * 获取文章数据（带缓存）
 */
function getPostsData(): Post[] {
  if (postsCache === null) {
    postsCache = loadPostsFromStorage()
  }
  return postsCache
}

/**
 * 更新缓存并保存到 localStorage
 */
function updateAndSave(posts: Post[]): void {
  postsCache = posts
  savePostsToStorage(posts)
}

/**
 * 生成新的文章 ID
 */
function generateId(): string {
  const posts = getPostsData()
  const maxId = posts.reduce((max, p) => {
    const id = Number.parseInt(p.id, 10)
    return Number.isNaN(id) ? max : Math.max(max, id)
  }, 0)
  return String(maxId + 1)
}

/**
 * 获取所有文章
 */
export function getPosts(): Post[] {
  return [...getPostsData()]
}

/**
 * 获取已发布的文章
 */
export function getPublishedPosts(): Post[] {
  return getPostsData().filter(p => p.status === 'published')
}

/**
 * 根据 ID 获取文章
 */
export function getPostById(id: string): Post | undefined {
  return getPostsData().find(p => p.id === id)
}

/**
 * 根据 slug 获取文章
 */
export function getPostBySlug(slug: string): Post | undefined {
  return getPostsData().find(p => p.slug === slug)
}

/**
 * 创建文章
 */
export function createPost(data: {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  status?: 'draft' | 'published'
}): Post {
  const posts = getPostsData()
  const newId = generateId()
  const now = new Date().toISOString()

  // 生成 slug
  const baseSlug = data.title
    .toLowerCase()
    .replace(/[^\w\u4E00-\u9FA5]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const slug = `${baseSlug}-${newId}`

  const newPost: Post = {
    id: newId,
    title: data.title,
    slug,
    excerpt: data.excerpt || `${data.content.slice(0, 100)}...`,
    content: data.content,
    coverImage: data.coverImage || `https://picsum.photos/seed/post${newId}/800/400`,
    author: {
      id: '1',
      name: '管理员',
      email: 'admin@techblog.com',
      avatar: 'https://picsum.photos/seed/admin/100/100',
      role: 'admin',
    },
    category: { id: '1', name: '前端开发', slug: 'frontend', postCount: 10 },
    tags: [],
    viewCount: 0,
    likeCount: 0,
    status: data.status || 'draft',
    publishedAt: data.status === 'published' ? now : undefined,
    createdAt: now,
    updatedAt: now,
  }

  const updatedPosts = [newPost, ...posts]
  updateAndSave(updatedPosts)

  return newPost
}

/**
 * 更新文章
 */
export function updatePost(id: string, data: Partial<Post>): Post | undefined {
  const posts = getPostsData()
  const index = posts.findIndex(p => p.id === id)
  if (index === -1)
    return undefined

  const oldPost = posts[index]
  if (!oldPost)
    return undefined

  const updatedPost: Post = {
    ...oldPost,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  // 如果状态从非发布变为发布，设置发布时间
  if (data.status === 'published' && oldPost.status !== 'published') {
    updatedPost.publishedAt = new Date().toISOString()
  }

  const updatedPosts = [...posts]
  updatedPosts[index] = updatedPost
  updateAndSave(updatedPosts)

  return updatedPost
}

/**
 * 删除文章
 */
export function deletePost(id: string): boolean {
  const posts = getPostsData()
  const index = posts.findIndex(p => p.id === id)
  if (index === -1)
    return false

  const updatedPosts = posts.filter(p => p.id !== id)
  updateAndSave(updatedPosts)

  return true
}

/**
 * 发布文章
 */
export function publishPost(id: string): Post | undefined {
  return updatePost(id, { status: 'published' })
}

/**
 * 取消发布
 */
export function unpublishPost(id: string): Post | undefined {
  return updatePost(id, { status: 'draft', publishedAt: undefined })
}

/**
 * 增加浏览量
 */
export function incrementViews(id: string): void {
  const posts = getPostsData()
  const post = posts.find(p => p.id === id)
  if (post) {
    post.viewCount++
    updateAndSave(posts)
  }
}

/**
 * 重置为默认数据
 */
export function resetPosts(): void {
  updateAndSave([...defaultPosts])
}

/**
 * 清除缓存（强制从 localStorage 重新加载）
 */
export function clearPostsCache(): void {
  postsCache = null
}

/**
 * 根据分类 slug 获取已发布的文章
 */
export function getPublishedPostsByCategorySlug(categorySlug: string): Post[] {
  return getPublishedPosts().filter(
    p => p.category && p.category.slug === categorySlug,
  )
}

/**
 * 根据标签 slug 获取已发布的文章
 */
export function getPublishedPostsByTagSlug(tagSlug: string): Post[] {
  return getPublishedPosts().filter(
    (p) => {
      const postTags = p.tags || []
      return postTags.some(t => t && t.slug === tagSlug)
    },
  )
}

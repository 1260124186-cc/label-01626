/**
 * 分类数据存储
 * 使用 localStorage 持久化存储，支持浏览器刷新后保留数据
 */

import type { Category } from '../types'

const STORAGE_KEY = 'techblog_categories'

// 默认的 mock 分类数据
const defaultCategories: Category[] = [
  {
    id: '1',
    name: '前端开发',
    slug: 'frontend',
    description: '前端开发相关技术文章，包括 Vue、React、Angular 等框架',
    postCount: 10,
  },
  {
    id: '2',
    name: '后端开发',
    slug: 'backend',
    description: '后端开发相关技术文章，包括 Node.js、Python、Java 等',
    postCount: 5,
  },
  {
    id: '3',
    name: '数据库',
    slug: 'database',
    description: '数据库相关技术文章，包括 MySQL、PostgreSQL、MongoDB 等',
    postCount: 3,
  },
  {
    id: '4',
    name: 'DevOps',
    slug: 'devops',
    description: 'DevOps 相关技术文章，包括 Docker、Kubernetes、CI/CD 等',
    postCount: 2,
  },
  {
    id: '5',
    name: '人工智能',
    slug: 'ai',
    description: '人工智能相关技术文章，包括机器学习、深度学习、NLP 等',
    postCount: 4,
  },
]

/**
 * 检查是否在浏览器环境
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * 从 localStorage 加载分类数据
 */
function loadCategoriesFromStorage(): Category[] {
  if (!isBrowser()) {
    return [...defaultCategories]
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
    console.warn('Failed to load categories from localStorage:', e)
  }

  // 首次加载时，保存默认数据到 localStorage
  saveCategoriesToStorage(defaultCategories)
  return [...defaultCategories]
}

/**
 * 保存分类数据到 localStorage
 */
function saveCategoriesToStorage(categories: Category[]): void {
  if (!isBrowser())
    return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }
  catch (e) {
    console.warn('Failed to save categories to localStorage:', e)
  }
}

// 内存中的分类数据（从 localStorage 初始化）
let categoriesCache: Category[] | null = null

/**
 * 获取分类数据（带缓存）
 */
function getCategoriesData(): Category[] {
  if (categoriesCache === null) {
    categoriesCache = loadCategoriesFromStorage()
  }
  return categoriesCache
}

/**
 * 更新缓存并保存到 localStorage
 */
function updateAndSave(categories: Category[]): void {
  categoriesCache = categories
  saveCategoriesToStorage(categories)
}

/**
 * 生成新的分类 ID
 */
function generateId(): string {
  const categories = getCategoriesData()
  const maxId = categories.reduce((max, c) => {
    const id = Number.parseInt(c.id, 10)
    return Number.isNaN(id) ? max : Math.max(max, id)
  }, 0)
  return String(maxId + 1)
}

/**
 * 生成 slug
 */
function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\u4E00-\u9FA5]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const categories = getCategoriesData()
  let slug = baseSlug
  let counter = 1

  // 确保 slug 唯一
  while (categories.some(c => c.slug === slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

/**
 * 获取所有分类
 */
export function getCategories(): Category[] {
  return [...getCategoriesData()]
}

/**
 * 根据 ID 获取分类
 */
export function getCategoryById(id: string): Category | undefined {
  return getCategoriesData().find(c => c.id === id)
}

/**
 * 根据 slug 获取分类
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategoriesData().find(c => c.slug === slug)
}

/**
 * 创建分类
 */
export function createCategory(data: {
  name: string
  description?: string
  slug?: string
}): Category {
  const categories = getCategoriesData()

  // 检查名称是否已存在
  if (categories.some(c => c.name === data.name)) {
    throw new Error('分类名称已存在')
  }

  const newId = generateId()
  const slug = data.slug || generateSlug(data.name)

  const newCategory: Category = {
    id: newId,
    name: data.name,
    slug,
    description: data.description,
    postCount: 0,
  }

  const updatedCategories = [...categories, newCategory]
  updateAndSave(updatedCategories)

  return newCategory
}

/**
 * 更新分类
 */
export function updateCategory(id: string, data: Partial<Category>): Category | undefined {
  const categories = getCategoriesData()
  const index = categories.findIndex(c => c.id === id)
  if (index === -1)
    return undefined

  const oldCategory = categories[index]
  if (!oldCategory)
    return undefined

  // 检查新名称是否与其他分类冲突
  if (data.name && data.name !== oldCategory.name) {
    if (categories.some(c => c.id !== id && c.name === data.name)) {
      throw new Error('分类名称已存在')
    }
  }

  // 如果提供了新的 slug，检查是否唯一
  if (data.slug && data.slug !== oldCategory.slug) {
    if (categories.some(c => c.id !== id && c.slug === data.slug)) {
      throw new Error('分类 slug 已存在')
    }
  }

  const updatedCategory: Category = {
    ...oldCategory,
    ...data,
  }

  const updatedCategories = [...categories]
  updatedCategories[index] = updatedCategory
  updateAndSave(updatedCategories)

  return updatedCategory
}

/**
 * 删除分类
 */
export function deleteCategory(id: string): boolean {
  const categories = getCategoriesData()
  const index = categories.findIndex(c => c.id === id)
  if (index === -1)
    return false

  const updatedCategories = categories.filter(c => c.id !== id)
  updateAndSave(updatedCategories)

  return true
}

/**
 * 批量删除分类
 */
export function batchDeleteCategories(ids: string[]): number {
  const categories = getCategoriesData()
  const updatedCategories = categories.filter(c => !ids.includes(c.id))
  const deletedCount = categories.length - updatedCategories.length
  updateAndSave(updatedCategories)
  return deletedCount
}

/**
 * 增加分类文章数
 */
export function incrementCategoryPostCount(id: string): void {
  const categories = getCategoriesData()
  const index = categories.findIndex(c => c.id === id)
  if (index !== -1) {
    categories[index] = {
      ...categories[index],
      postCount: categories[index].postCount + 1,
    }
    updateAndSave(categories)
  }
}

/**
 * 减少分类文章数
 */
export function decrementCategoryPostCount(id: string): void {
  const categories = getCategoriesData()
  const index = categories.findIndex(c => c.id === id)
  if (index !== -1 && categories[index].postCount > 0) {
    categories[index] = {
      ...categories[index],
      postCount: categories[index].postCount - 1,
    }
    updateAndSave(categories)
  }
}

/**
 * 重置为默认
/**
 * 分类数据存储
 * 使用 localStorage 持久化存储，支持浏览器刷新后保留数据
 */

import type { Category } from '../types'
import { getPosts, updatePost } from './posts'

const STORAGE_KEY = 'techblog_categories'

const defaultCategories: Category[] = [
  { id: '1', name: '前端开发', slug: 'frontend', description: 'Vue、React、Angular 等前端框架和技术', postCount: 10 },
  { id: '2', name: '后端开发', slug: 'backend', description: 'Node.js、Python、Java 等后端技术', postCount: 5 },
  { id: '3', name: 'DevOps', slug: 'devops', description: 'CI/CD、Docker、Kubernetes 等运维技术', postCount: 3 },
  { id: '4', name: '人工智能', slug: 'ai', description: '机器学习、深度学习、NLP 等 AI 技术', postCount: 2 },
  { id: '5', name: '移动开发', slug: 'mobile', description: 'iOS、Android、Flutter、React Native 等', postCount: 4 },
]

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

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

  saveCategoriesToStorage(defaultCategories)
  return [...defaultCategories]
}

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

let categoriesCache: Category[] | null = null

function getCategoriesData(): Category[] {
  if (categoriesCache === null) {
    categoriesCache = loadCategoriesFromStorage()
  }
  return categoriesCache
}

function updateAndSave(categories: Category[]): void {
  categoriesCache = categories
  saveCategoriesToStorage(categories)
}

function generateId(): string {
  const categories = getCategoriesData()
  const maxId = categories.reduce((max, c) => {
    const id = Number.parseInt(c.id, 10)
    return Number.isNaN(id) ? max : Math.max(max, id)
  }, 0)
  return String(maxId + 1)
}

function generateSlug(name: string, excludeId?: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\u4E00-\u9FA5]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const categories = getCategoriesData()
  let slug = baseSlug
  let counter = 1

  while (categories.some(c => c.slug === slug && c.id !== excludeId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export function recalculateAllCategoryPostCounts(): void {
  const categories = getCategoriesData()
  const posts = getPosts()

  categories.forEach(category => {
    category.postCount = posts.filter(p => p.category?.id === category.id).length
  })

  updateAndSave(categories)
}

export function getCategories(): Category[] {
  return [...getCategoriesData()]
}

export function getCategoryById(id: string): Category | undefined {
  return getCategoriesData().find(c => c.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategoriesData().find(c => c.slug === slug)
}

export function createCategory(data: {
  name: string
  slug?: string
  description?: string
  parentId?: string
}): Category {
  const categories = getCategoriesData()
  const newId = generateId()

  const newCategory: Category = {
    id: newId,
    name: data.name,
    slug: data.slug || generateSlug(data.name),
    description: data.description,
    parentId: data.parentId,
    postCount: 0,
  }

  const updatedCategories = [...categories, newCategory]
  updateAndSave(updatedCategories)

  return newCategory
}

export function updateCategory(id: string, data: Partial<Category>): Category | undefined {
  const categories = getCategoriesData()
  const index = categories.findIndex(c => c.id === id)
  if (index === -1)
    return undefined

  const oldCategory = categories[index]
  if (!oldCategory)
    return undefined

  const updatedCategory: Category = {
    ...oldCategory,
    ...data,
  }

  if (data.slug === undefined && data.name !== oldCategory.name) {
    updatedCategory.slug = generateSlug(data.name!, id)
  }

  const updatedCategories = [...categories]
  updatedCategories[index] = updatedCategory
  updateAndSave(updatedCategories)

  const posts = getPosts()
  posts.forEach(post => {
    if (post.category?.id === id) {
      updatePost(post.id, { category: updatedCategory })
    }
  })

  return updatedCategory
}

export function deleteCategory(id: string): boolean {
  const categories = getCategoriesData()
  const index = categories.findIndex(c => c.id === id)
  if (index === -1)
    return false

  const updatedCategories = categories.filter(c => c.id !== id)
  updateAndSave(updatedCategories)

  return true
}

export function resetCategories(): void {
  updateAndSave([...defaultCategories])
}

export function clearCategoriesCache(): void {
  categoriesCache = null
}

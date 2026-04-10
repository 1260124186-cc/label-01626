import type { Category } from '../types'

const STORAGE_KEY = 'techblog_categories'

const defaultCategories: Category[] = [
  {
    id: '1',
    name: '前端开发',
    slug: 'frontend',
    description: '前端技术相关文章，包括 Vue、React、CSS 等',
    postCount: 10,
  },
  {
    id: '2',
    name: '后端开发',
    slug: 'backend',
    description: '后端技术相关文章，包括 Node.js、Python、Java 等',
    postCount: 5,
  },
  {
    id: '3',
    name: 'DevOps',
    slug: 'devops',
    description: '开发运维相关文章，包括 Docker、Kubernetes 等',
    postCount: 3,
  },
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
  slug: string
  description?: string
  parentId?: string
}): Category {
  const categories = getCategoriesData()
  const newId = generateId()

  const newCategory: Category = {
    id: newId,
    name: data.name,
    slug: data.slug,
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

  const updatedCategories = [...categories]
  updatedCategories[index] = updatedCategory
  updateAndSave(updatedCategories)

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

export function incrementCategoryPostCount(categoryId: string): void {
  const categories = getCategoriesData()
  const category = categories.find(c => c.id === categoryId)
  if (category) {
    category.postCount++
    updateAndSave(categories)
  }
}

export function decrementCategoryPostCount(categoryId: string): void {
  const categories = getCategoriesData()
  const category = categories.find(c => c.id === categoryId)
  if (category && category.postCount > 0) {
    category.postCount--
    updateAndSave(categories)
  }
}

export function resetCategories(): void {
  updateAndSave([...defaultCategories])
}

export function clearCategoriesCache(): void {
  categoriesCache = null
}

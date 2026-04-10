/**
 * 标签数据存储
 * 使用 localStorage 持久化存储，支持浏览器刷新后保留数据
 */

import type { Tag } from '../types'
import { getPosts, updatePost } from './posts'

const STORAGE_KEY = 'techblog_tags'

const defaultTags: Tag[] = [
  { id: '1', name: 'Vue', slug: 'vue', postCount: 5 },
  { id: '2', name: 'JavaScript', slug: 'javascript', postCount: 8 },
  { id: '3', name: 'TypeScript', slug: 'typescript', postCount: 6 },
  { id: '4', name: 'CSS', slug: 'css', postCount: 4 },
  { id: '5', name: 'Tailwind', slug: 'tailwind', postCount: 3 },
  { id: '6', name: 'React', slug: 'react', postCount: 7 },
  { id: '7', name: 'Node.js', slug: 'nodejs', postCount: 4 },
  { id: '8', name: 'Python', slug: 'python', postCount: 2 },
]

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

function loadTagsFromStorage(): Tag[] {
  if (!isBrowser()) {
    return [...defaultTags]
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
    console.warn('Failed to load tags from localStorage:', e)
  }

  saveTagsToStorage(defaultTags)
  return [...defaultTags]
}

function saveTagsToStorage(tags: Tag[]): void {
  if (!isBrowser())
    return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
  }
  catch (e) {
    console.warn('Failed to save tags to localStorage:', e)
  }
}

let tagsCache: Tag[] | null = null

function getTagsData(): Tag[] {
  if (tagsCache === null) {
    tagsCache = loadTagsFromStorage()
  }
  return tagsCache
}

function updateAndSave(tags: Tag[]): void {
  tagsCache = tags
  saveTagsToStorage(tags)
}

function generateId(): string {
  const tags = getTagsData()
  const maxId = tags.reduce((max, t) => {
    const id = Number.parseInt(t.id, 10)
    return Number.isNaN(id) ? max : Math.max(max, id)
  }, 0)
  return String(maxId + 1)
}

function generateSlug(name: string, excludeId?: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\u4E00-\u9FA5]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  const tags = getTagsData()
  let slug = baseSlug
  let counter = 1
  
  while (tags.some(t => t.slug === slug && t.id !== excludeId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

export function recalculateAllTagPostCounts(): void {
  const tags = getTagsData()
  const posts = getPosts()
  
  tags.forEach(tag => {
    tag.postCount = posts.filter(p => p.tags?.some((t: Tag) => t.id === tag.id)).length
  })
  
  updateAndSave(tags)
}

export function getTags(): Tag[] {
  return [...getTagsData()]
}

export function getTagById(id: string): Tag | undefined {
  return getTagsData().find(t => t.id === id)
}

export function getTagBySlug(slug: string): Tag | undefined {
  return getTagsData().find(t => t.slug === slug)
}

export function getTagByName(name: string): Tag | undefined {
  return getTagsData().find(t => t.name.toLowerCase() === name.toLowerCase())
}

export function getOrCreateTag(name: string): Tag {
  const existing = getTagByName(name)
  if (existing) {
    return existing
  }
  
  return createTag({ name })
}

export function createTag(data: {
  name: string
  slug?: string
}): Tag {
  const tags = getTagsData()
  const newId = generateId()

  const newTag: Tag = {
    id: newId,
    name: data.name,
    slug: data.slug || generateSlug(data.name),
    postCount: 0,
  }

  const updatedTags = [...tags, newTag]
  updateAndSave(updatedTags)

  return newTag
}

export function updateTag(id: string, data: Partial<Tag>): Tag | undefined {
  const tags = getTagsData()
  const index = tags.findIndex(t => t.id === id)
  if (index === -1)
    return undefined

  const oldTag = tags[index]
  if (!oldTag)
    return undefined

  const updatedTag: Tag = {
    ...oldTag,
    ...data,
  }

  if (data.slug === undefined && data.name !== oldTag.name) {
    updatedTag.slug = generateSlug(data.name!, id)
  }

  const updatedTags = [...tags]
  updatedTags[index] = updatedTag
  updateAndSave(updatedTags)

  const posts = getPosts()
  posts.forEach(post => {
    const tagIndex = post.tags?.findIndex((t: Tag) => t.id === id)
    if (tagIndex !== undefined && tagIndex > -1) {
      const newTags = [...(post.tags || [])]
      newTags[tagIndex] = updatedTag
      updatePost(post.id, { tags: newTags })
    }
  })

  return updatedTag
}

export function deleteTag(id: string): boolean {
  const tags = getTagsData()
  const index = tags.findIndex(t => t.id === id)
  if (index === -1)
    return false

  const updatedTags = tags.filter(t => t.id !== id)
  updateAndSave(updatedTags)

  return true
}

export function batchDeleteTags(ids: string[]): number {
  const tags = getTagsData()
  const updatedTags = tags.filter(t => !ids.includes(t.id))
  const deletedCount = tags.length - updatedTags.length
  updateAndSave(updatedTags)
  return deletedCount
}

export function mergeTags(sourceIds: string[], targetId: string): Tag | undefined {
  const targetTag = getTagById(targetId)
  if (!targetTag) {
    return undefined
  }

  const posts = getPosts()
  posts.forEach(post => {
    const postTags = post.tags || []
    let hasTargetTag = postTags.some((t: Tag) => t.id === targetId)
    let hasSourceTag = false
    
    const newTags = postTags.filter((t: Tag) => {
      if (sourceIds.includes(t.id)) {
        hasSourceTag = true
        return false
      }
      return true
    })
    
    if (hasSourceTag && !hasTargetTag) {
      newTags.push(targetTag)
      updatePost(post.id, { tags: newTags })
    }
    else if (hasSourceTag) {
      updatePost(post.id, { tags: newTags })
    }
  })

  const tags = getTagsData()
  const updatedTags = tags.filter(t => !sourceIds.includes(t.id))
  updateAndSave(updatedTags)
  
  recalculateAllTagPostCounts()

  return getTagById(targetId)
}

export function resetTags(): void {
  updateAndSave([...defaultTags])
}

export function clearTagsCache(): void {
  tagsCache = null
}

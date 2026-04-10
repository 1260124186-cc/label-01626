import type { Tag } from '../types'

const STORAGE_KEY = 'techblog_tags'

const defaultTags: Tag[] = [
  { id: '1', name: 'Vue', slug: 'vue', postCount: 5 },
  { id: '2', name: 'JavaScript', slug: 'javascript', postCount: 8 },
  { id: '3', name: 'TypeScript', slug: 'typescript', postCount: 6 },
  { id: '4', name: 'CSS', slug: 'css', postCount: 4 },
  { id: '5', name: 'Tailwind', slug: 'tailwind', postCount: 3 },
  { id: '6', name: 'React', slug: 'react', postCount: 4 },
  { id: '7', name: 'Node.js', slug: 'nodejs', postCount: 2 },
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
  return getTagsData().find(
    t => t.name.toLowerCase() === name.toLowerCase(),
  )
}

export function createTag(data: { name: string, slug: string }): Tag {
  const tags = getTagsData()
  const newId = generateId()

  const newTag: Tag = {
    id: newId,
    name: data.name,
    slug: data.slug,
    postCount: 0,
  }

  const updatedTags = [...tags, newTag]
  updateAndSave(updatedTags)

  return newTag
}

export function getOrCreateTag(name: string): Tag {
  const existing = getTagByName(name)
  if (existing)
    return existing

  const slug = name
    .toLowerCase()
    .replace(/[^\w\u4E00-\u9FA5]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return createTag({ name, slug })
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

  const updatedTags = [...tags]
  updatedTags[index] = updatedTag
  updateAndSave(updatedTags)

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

export function deleteTags(ids: string[]): boolean {
  const tags = getTagsData()
  const updatedTags = tags.filter(t => !ids.includes(t.id))
  updateAndSave(updatedTags)
  return true
}

export function mergeTags(sourceIds: string[], targetId: string): Tag | undefined {
  const tags = getTagsData()
  const targetTag = tags.find(t => t.id === targetId)
  if (!targetTag)
    return undefined

  let totalPostCount = targetTag.postCount
  sourceIds.forEach((id) => {
    const sourceTag = tags.find(t => t.id === id)
    if (sourceTag)
      totalPostCount += sourceTag.postCount
  })

  targetTag.postCount = totalPostCount

  const updatedTags = tags.filter(
    t => t.id === targetId || !sourceIds.includes(t.id),
  )

  updateAndSave(updatedTags)
  return targetTag
}

export function incrementTagPostCount(tagId: string): void {
  const tags = getTagsData()
  const tag = tags.find(t => t.id === tagId)
  if (tag) {
    tag.postCount++
    updateAndSave(tags)
  }
}

export function decrementTagPostCount(tagId: string): void {
  const tags = getTagsData()
  const tag = tags.find(t => t.id === tagId)
  if (tag && tag.postCount > 0) {
    tag.postCount--
    updateAndSave(tags)
  }
}

export function resetTags(): void {
  updateAndSave([...defaultTags])
}

export function clearTagsCache(): void {
  tagsCache = null
}

<script setup lang="ts">
import type { Category, Tag } from '@blog/shared'
import { createPost, getCategories, getOrCreateTag, getPostById, getTags, updatePost } from '@blog/shared'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UButton, UInput, UTextarea, USelectMenu } from '@/components/ui'

const route = useRoute()
const router = useRouter()

const postId = computed(() => (route.params.id ? String(route.params.id) : null))
const isEdit = computed(() => !!postId.value)
const pageTitle = computed(() => (isEdit.value ? '编辑文章' : '新建文章'))

const categories = ref<Category[]>([])
const allTags = ref<Tag[]>([])
const newTagInput = ref('')
const tagSuggestions = ref<Tag[]>([])

const form = ref({
  title: '',
  content: '',
  excerpt: '',
  categoryId: '',
  tagIds: [] as string[],
})

const errors = ref<Record<string, string>>({})

function loadFormData() {
  categories.value = getCategories()
  allTags.value = getTags()
}

// 加载文章数据（编辑模式）
onMounted(() => {
  loadFormData()

  if (isEdit.value && postId.value) {
    const post = getPostById(postId.value)
    if (post) {
      form.value = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        categoryId: post.category?.id || '',
        tagIds: post.tags?.map(t => t.id) || [],
      }
    }
    else {
      router.push('/posts')
    }
  }
})

const selectedTagObjects = computed(() =>
  form.value.tagIds.map(id => allTags.value.find(t => t.id === id)).filter(Boolean) as Tag[],
)

function updateTagSuggestions() {
  if (!newTagInput.value) {
    tagSuggestions.value = []
    return
  }
  const query = newTagInput.value.toLowerCase()
  tagSuggestions.value = allTags.value.filter(
    t =>
      t.name.toLowerCase().includes(query)
      && !form.value.tagIds.includes(t.id),
  ).slice(0, 5)
}

function addTag(tag: Tag) {
  if (!form.value.tagIds.includes(tag.id)) {
    form.value.tagIds.push(tag.id)
  }
  newTagInput.value = ''
  tagSuggestions.value = []
}

function addNewTag() {
  if (!newTagInput.value.trim())
    return

  const newTag = getOrCreateTag(newTagInput.value.trim())
  if (newTag && !form.value.tagIds.includes(newTag.id)) {
    form.value.tagIds.push(newTag.id)
    allTags.value = getTags()
  }
  newTagInput.value = ''
  tagSuggestions.value = []
}

function removeTag(tagId: string) {
  const index = form.value.tagIds.indexOf(tagId)
  if (index > -1) {
    form.value.tagIds.splice(index, 1)
  }
}

function getCategoryById(categoryId: string): Category | undefined {
  return categories.value.find(c => c.id === categoryId)
}

const isSaving = ref(false)

function validate() {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = '请输入文章标题'
  }

  if (!form.value.content.trim()) {
    errors.value.content = '请输入文章内容'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSave(publish = false) {
  if (!validate()) {
    return
  }

  isSaving.value = true

  try {
    const status = publish ? 'published' : 'draft'

    const category = getCategoryById(form.value.categoryId)
    const tags = selectedTagObjects.value

    if (isEdit.value && postId.value) {
      // 更新文章
      updatePost(postId.value, {
        title: form.value.title,
        content: form.value.content,
        excerpt: form.value.excerpt || `${form.value.content.slice(0, 100)}...`,
        status,
        category,
        tags,
      })
    }
    else {
      // 创建新文章
      createPost({
        title: form.value.title,
        content: form.value.content,
        excerpt: form.value.excerpt,
        status,
        category,
        tags,
      })
    }

    router.push('/posts')
  }
  catch (error) {
    console.error('保存失败:', error)
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors hover:bg-slate-100"
          @click="router.back()"
        >
          ⬅️
        </button>
        <h1 class="text-xl font-semibold text-slate-900">
          {{ pageTitle }}
        </h1>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline" :loading="isSaving" @click="handleSave(false)">
          📝 保存草稿
        </UButton>
        <UButton color="primary" :loading="isSaving" @click="handleSave(true)">
          🚀 发布文章
        </UButton>
      </div>
    </div>

    <!-- 主内容区 - 单栏布局 -->
    <div class="mx-auto max-w-4xl space-y-6">
      <!-- 标题 -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label class="mb-2 block text-sm font-medium text-slate-700">
          文章标题 <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="form.title"
          placeholder="请输入文章标题"
          size="lg"
          :color="errors.title ? 'red' : undefined"
        />
        <p v-if="errors.title" class="mt-2 text-sm text-red-500">
          {{ errors.title }}
        </p>
      </div>

      <!-- 内容 -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label class="mb-2 block text-sm font-medium text-slate-700">
          文章内容 <span class="text-red-500">*</span>
        </label>
        <UTextarea
          v-model="form.content"
          placeholder="请输入文章内容（支持 Markdown 语法）"
          :rows="20"
          :color="errors.content ? 'red' : undefined"
        />
        <p v-if="errors.content" class="mt-2 text-sm text-red-500">
          {{ errors.content }}
        </p>
        <p class="mt-2 text-sm text-slate-500">
          支持 Markdown 语法，如 # 标题、**粗体**、- 列表等
        </p>
      </div>

      <!-- 摘要 -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label class="mb-2 block text-sm font-medium text-slate-700"> 文章摘要 </label>
        <UTextarea
          v-model="form.excerpt"
          placeholder="请输入文章摘要（用于列表展示，留空将自动截取内容前100字）"
          :rows="3"
        />
      </div>

      <!-- 分类和标签 -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label class="mb-2 block text-sm font-medium text-slate-700"> 文章分类 </label>
          <select
            v-model="form.categoryId"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">选择分类</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label class="mb-2 block text-sm font-medium text-slate-700"> 文章标签 </label>
          <div class="mb-3 flex flex-wrap gap-2">
            <span
              v-for="tag in selectedTagObjects"
              :key="tag.id"
              class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
            >
              {{ tag.name }}
              <button
                class="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                @click="removeTag(tag.id)"
              >
                ×
              </button>
            </span>
          </div>
          <div class="relative">
            <UInput
              v-model="newTagInput"
              placeholder="输入标签名称后回车添加"
              @input="updateTagSuggestions"
              @keyup.enter.prevent="addNewTag"
            />
            <transition
              enter-active-class="transition-opacity duration-150"
              enter-from-class="opacity-0"
              leave-active-class="transition-opacity duration-100"
              leave-to-class="opacity-0"
            >
              <div
                v-if="tagSuggestions.length > 0"
                class="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
              >
                <button
                  v-for="tag in tagSuggestions"
                  :key="tag.id"
                  class="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  @click="addTag(tag)"
                >
                  {{ tag.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

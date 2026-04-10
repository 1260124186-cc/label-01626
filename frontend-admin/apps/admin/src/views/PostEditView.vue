<script setup lang="ts">
import { createPost, getCategories, getOrCreateTag, getPostById, getTags, updatePost } from '@blog/shared'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UButton, UInput, USelectMenu, UTextarea } from '@/components/ui'

const route = useRoute()
const router = useRouter()

const postId = computed(() => (route.params.id ? String(route.params.id) : null))
const isEdit = computed(() => !!postId.value)
const pageTitle = computed(() => (isEdit.value ? '编辑文章' : '新建文章'))

const form = ref({
  title: '',
  content: '',
  excerpt: '',
  categoryId: '',
  tagIds: [] as string[],
})

const allCategories = ref(getCategories())
const allTags = ref(getTags())
const tagInput = ref('')
const selectedTags = ref<Array<{ id: string, name: string }>>([])

const errors = ref<Record<string, string>>({})

function refreshData() {
  allCategories.value = getCategories()
  allTags.value = getTags()
}

function getTagSelectOptions() {
  return allTags.value.map(tag => ({
    value: tag.id,
    label: tag.name,
  }))
}

function getCategorySelectOptions() {
  return allCategories.value.map(category => ({
    value: category.id,
    label: category.name,
  }))
}

function handleTagInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    const tagName = tagInput.value.trim()
    if (tagName) {
      addTagByName(tagName)
      tagInput.value = ''
    }
  }
}

function addTagByName(name: string) {
  const existing = selectedTags.value.find(t => t.name.toLowerCase() === name.toLowerCase())
  if (existing) {
    return
  }

  const tag = getOrCreateTag(name)
  if (!form.value.tagIds.includes(tag.id)) {
    form.value.tagIds.push(tag.id)
    selectedTags.value.push({ id: tag.id, name: tag.name })
  }
  refreshData()
}

function removeTag(tagId: string) {
  form.value.tagIds = form.value.tagIds.filter(id => id !== tagId)
  selectedTags.value = selectedTags.value.filter(t => t.id !== tagId)
}

function handleTagSelect(value: string) {
  const tagId = value
  if (tagId && !form.value.tagIds.includes(tagId)) {
    const tag = allTags.value.find(t => t.id === tagId)
    if (tag) {
      form.value.tagIds.push(tagId)
      selectedTags.value.push({ id: tagId, name: tag.name })
    }
  }
}

// 加载文章数据（编辑模式）
onMounted(() => {
  refreshData()

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
      selectedTags.value = post.tags?.map(t => ({ id: t.id, name: t.name })) || []
    }
    else {
      router.push('/posts')
    }
  }
})

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

    if (isEdit.value && postId.value) {
      // 更新文章
      updatePost(postId.value, {
        title: form.value.title,
        content: form.value.content,
        excerpt: form.value.excerpt || `${form.value.content.slice(0, 100)}...`,
        status,
        categoryId: form.value.categoryId,
        tagIds: form.value.tagIds,
      })
    }
    else {
      // 创建新文章
      createPost({
        title: form.value.title,
        content: form.value.content,
        excerpt: form.value.excerpt,
        status,
        categoryId: form.value.categoryId,
        tagIds: form.value.tagIds,
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
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium text-slate-700"> 文章分类 </label>
          <USelectMenu
            v-model:value="form.categoryId"
            :items="getCategorySelectOptions()"
            placeholder="请选择分类"
            clearable
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"> 文章标签 </label>
          <div class="mb-3 flex flex-wrap gap-2">
            <div
              v-for="tag of selectedTags"
              :key="tag.id"
              class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
            >
              <span>{{ tag.name }}</span>
              <button
                type="button"
                class="flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                @click="removeTag(tag.id)"
              >
                ×
              </button>
            </div>
            <div v-if="selectedTags.length === 0" class="text-sm text-slate-400">
              暂无标签，输入后按回车或从下拉菜单选择添加
            </div>
          </div>
          <div class="flex gap-2">
            <UInput
              v-model="tagInput"
              class="flex-1"
              placeholder="输入标签名称，按回车确认"
              @keydown="handleTagInputKeydown"
            />
            <USelectMenu
              value=""
              :items="getTagSelectOptions()"
              placeholder="选择已有标签"
              clearable
              style="min-width: 160px"
              @change="handleTagSelect"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

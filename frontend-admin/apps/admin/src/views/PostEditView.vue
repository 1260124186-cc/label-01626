<script setup lang="ts">
import { createPost, getPostById, updatePost } from '@blog/shared'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UButton, UInput, UTextarea } from '@/components/ui'

const route = useRoute()
const router = useRouter()

const postId = computed(() => (route.params.id ? String(route.params.id) : null))
const isEdit = computed(() => !!postId.value)
const pageTitle = computed(() => (isEdit.value ? '编辑文章' : '新建文章'))

const form = ref({
  title: '',
  content: '',
  excerpt: '',
})

const errors = ref<Record<string, string>>({})

// 加载文章数据（编辑模式）
onMounted(() => {
  if (isEdit.value && postId.value) {
    const post = getPostById(postId.value)
    if (post) {
      form.value = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
      }
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
      })
    }
    else {
      // 创建新文章
      createPost({
        title: form.value.title,
        content: form.value.content,
        excerpt: form.value.excerpt,
        status,
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
    </div>
  </div>
</template>

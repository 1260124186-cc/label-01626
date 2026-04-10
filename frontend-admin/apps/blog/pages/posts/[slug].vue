<script setup lang="ts">
import type { Post } from '@blog/shared'
import { getPublishedPosts, incrementViews } from '@blog/shared'

const route = useRoute()
const router = useRouter()

// 使用 useAsyncData 确保 SSR 和客户端数据一致
const { data: post, error } = await useAsyncData<Post | null>(`post-${route.params.slug}`, () => {
  const slug = route.params.slug as string
  const posts = getPublishedPosts()
  const foundPost = posts.find(p => p.slug === slug)
  return Promise.resolve(foundPost || null)
})

const notFound = computed(() => !post.value && !error.value)

// 渲染后的 Markdown HTML 内容
const renderedContent = computed(() => {
  if (!post.value?.content)
    return ''
  return renderMarkdown(post.value.content)
})

// 增加浏览量（仅在客户端）
onMounted(() => {
  if (post.value) {
    incrementViews(post.value.id)
  }
})

// SEO
useSeoMeta({
  title: computed(() =>
    post.value ? `${post.value.title} - TechBlog` : '文章未找到 - TechBlog',
  ),
  description: computed(() => post.value?.excerpt || ''),
})

// 返回首页
function goBack() {
  router.push('/')
}

// 格式化日期 - 使用固定格式避免 hydration mismatch
function formatDateSimple(dateStr: string | undefined): string {
  if (!dateStr)
    return ''
  const d = new Date(dateStr)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 404 状态 -->
    <div v-if="notFound" class="container mx-auto px-4 py-20 text-center lg:px-8">
      <div class="mb-6 text-6xl">
        📄
      </div>
      <h1 class="mb-4 text-3xl font-bold text-slate-900">
        文章未找到
      </h1>
      <p class="mb-8 text-slate-500">
        抱歉，您访问的文章不存在或已被删除
      </p>
      <UButton color="primary" size="lg" class="cursor-pointer" @click="goBack">
        🏠 返回首页
      </UButton>
    </div>

    <!-- 文章详情 -->
    <article v-else-if="post" class="pb-16">
      <!-- 文章头部 -->
      <header
        class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-16 text-white lg:py-24"
      >
        <div class="absolute inset-0 opacity-20">
          <div
            class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"
          />
        </div>
        <div class="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
        <div class="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

        <div class="container relative z-10 mx-auto px-4 lg:px-8">
          <div class="mx-auto max-w-4xl">
            <!-- 返回按钮 -->
            <button
              class="mb-8 inline-flex items-center gap-2 text-blue-200 transition-colors hover:text-white"
              @click="goBack"
            >
              <span>⬅️</span>
              <span>返回首页</span>
            </button>

            <!-- 分类和日期 -->
            <div class="mb-6 flex items-center gap-4">
              <span
                class="inline-flex items-center rounded-lg border border-blue-400/30 bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-100"
              >
                📁 {{ post.category.name }}
              </span>
              <span class="text-blue-200">
                📅 {{ formatDateSimple(post.publishedAt || post.createdAt) }}
              </span>
            </div>

            <!-- 标题 -->
            <h1 class="mb-6 text-3xl font-bold leading-tight lg:text-5xl">
              {{ post.title }}
            </h1>

            <!-- 摘要 -->
            <p class="mb-8 text-xl text-blue-100/80">
              {{ post.excerpt }}
            </p>

            <!-- 作者和统计 -->
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-lg font-medium text-white"
                >
                  {{ post.author.name.charAt(0) }}
                </div>
                <div>
                  <div class="font-semibold">
                    {{ post.author.name }}
                  </div>
                  <div class="text-sm text-blue-200">
                    作者
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-6 text-blue-200">
                <span class="flex items-center gap-2"> 👁️ {{ post.viewCount }} 阅读 </span>
                <span class="flex items-center gap-2"> ❤️ {{ post.likeCount }} 喜欢 </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 文章内容 -->
      <div class="container mx-auto px-4 py-12 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
            <!-- 标签 -->
            <div class="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-8">
              <span class="mr-2 text-slate-500">🏷️ 标签:</span>
              <span
                v-for="tag in post.tags"
                :key="tag.id"
                class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- Markdown 内容 -->
            <div class="prose-content">
              <div v-html="renderedContent" />
            </div>
          </div>

          <!-- 底部操作 -->
          <div class="mt-8 flex justify-center">
            <UButton
              color="primary"
              size="lg"
              variant="outline"
              class="cursor-pointer text-slate-900"
              @click="goBack"
            >
              🏠 返回首页查看更多文章
            </UButton>
          </div>
        </div>
      </div>
    </article>

    <!-- 加载状态 -->
    <div v-else class="container mx-auto px-4 py-20 text-center lg:px-8">
      <div class="mb-4 animate-pulse text-4xl">
        📖
      </div>
      <p class="text-slate-500">
        加载中...
      </p>
    </div>
  </div>
</template>

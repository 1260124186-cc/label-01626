<script setup lang="ts">
import type { Post } from '@blog/shared'
import { getPublishedPosts } from '@blog/shared'

// SEO
useSeoMeta({
  title: '首页 - TechBlog',
  description: '欢迎来到 TechBlog，一个现代化的技术博客平台',
})

// 使用 useAsyncData 确保 SSR 和客户端数据一致
const { data: allPosts } = await useAsyncData<Post[]>('posts', () => {
  return Promise.resolve(getPublishedPosts())
})

// 只显示前6篇文章
const posts = computed(() => allPosts.value?.slice(0, 6) || [])

// 统计数据
const stats = computed(() => [
  { label: '文章总数', value: allPosts.value?.length || 0 },
  {
    label: '总浏览量',
    value: allPosts.value?.reduce((sum: number, p: Post) => sum + p.viewCount, 0) || 0,
  },
])

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
  <div class="min-h-screen">
    <!-- Hero 区域 -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"
        />
      </div>
      <div class="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
      <div class="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

      <div class="container relative z-10 mx-auto px-4 py-16 lg:px-8 lg:py-24">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
            TechBlog 技术博客
          </h1>
          <p class="mb-8 text-xl text-blue-100/80">
            分享前沿技术文章，记录开发心得
          </p>

          <!-- 统计数据 -->
          <div class="flex justify-center gap-8">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="rounded-xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm"
            >
              <div class="text-2xl font-bold text-white">
                {{ stat.value }}
              </div>
              <div class="text-sm text-blue-200/70">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="bg-slate-50 py-12 lg:py-16">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="mb-8 flex items-center gap-2">
          <div class="h-6 w-1 rounded-full bg-blue-600" />
          <h2 class="text-2xl font-bold text-slate-900">
            文章列表
          </h2>
        </div>

        <!-- 空状态 -->
        <div v-if="posts.length === 0" class="py-16 text-center">
          <div class="mx-auto mb-4 text-6xl">
            📄
          </div>
          <h3 class="mb-2 text-xl font-semibold text-slate-600">
            暂无文章
          </h3>
          <p class="text-slate-500">
            请在管理后台创建并发布文章
          </p>
          <NuxtLink
            to="/admin"
            class="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100"
          >
            🔧 前往管理后台
          </NuxtLink>
        </div>

        <!-- 文章网格 -->
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="post in posts"
            :key="post.id"
            :to="`/posts/${post.slug}`"
            class="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <!-- 封面图 -->
            <div class="aspect-video overflow-hidden bg-slate-100">
              <img
                :src="post.coverImage"
                :alt="post.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              >
            </div>

            <!-- 内容 -->
            <div class="p-5">
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                >
                  📁 {{ post.category.name }}
                </span>
                <span class="text-sm text-slate-500">
                  📅 {{ formatDateSimple(post.publishedAt || post.createdAt) }}
                </span>
              </div>

              <h3
                class="mb-2 line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600"
              >
                {{ post.title }}
              </h3>

              <p class="mb-4 line-clamp-2 text-sm text-slate-600">
                {{ post.excerpt }}
              </p>

              <!-- 统计 -->
              <div class="flex items-center justify-between border-t border-slate-100 pt-4">
                <div class="flex items-center gap-2">
                  <div
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-medium text-white"
                  >
                    {{ post.author.name.charAt(0) }}
                  </div>
                  <span class="text-sm text-slate-600">{{ post.author.name }}</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-slate-500">
                  <span class="flex items-center gap-1"> 👁️ {{ post.viewCount }} </span>
                  <span class="flex items-center gap-1"> ❤️ {{ post.likeCount }} </span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

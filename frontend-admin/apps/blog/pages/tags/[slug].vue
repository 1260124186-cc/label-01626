<script setup lang="ts">
import type { Post, Tag } from '@blog/shared'
import { getPublishedPosts, getTagBySlug } from '@blog/shared'

const route = useRoute()
const router = useRouter()

const slug = computed(() => route.params.slug as string)

const { data: tag, error } = await useAsyncData<Tag | null>(`tag-${slug.value}`, () => {
  const foundTag = getTagBySlug(slug.value)
  return Promise.resolve(foundTag || null)
})

const { data: allPosts } = await useAsyncData<Post[]>('tag-posts', () => {
  return Promise.resolve(getPublishedPosts())
})

const tagPosts = computed(() => {
  if (!tag.value) return []
  return allPosts.value?.filter((p: Post) => p.tags?.some((t: Tag) => t.id === tag.value?.id)) || []
})

const notFound = computed(() => !tag.value && !error.value)

useSeoMeta({
  title: computed(() =>
    tag.value ? `标签: ${tag.value.name} - TechBlog` : '标签未找到 - TechBlog',
  ),
  description: computed(() => `查看所有标记为 "${tag.value?.name || ''}" 的技术文章`),
})

function goBack() {
  router.push('/')
}

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
        🏷️
      </div>
      <h1 class="mb-4 text-3xl font-bold text-slate-900">
        标签未找到
      </h1>
      <p class="mb-8 text-slate-500">
        抱歉，您访问的标签不存在
      </p>
      <UButton color="primary" size="lg" class="cursor-pointer" @click="goBack">
        🏠 返回首页
      </UButton>
    </div>

    <!-- 标签文章列表 -->
    <div v-else-if="tag" class="pb-16">
      <!-- 头部 Banner -->
      <section
        class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-800 to-teal-900 py-16 text-white lg:py-20"
      >
        <div class="absolute inset-0 opacity-20">
          <div
            class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"
          />
        </div>
        <div class="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl" />
        <div class="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-teal-500/30 blur-3xl" />

        <div class="container relative z-10 mx-auto px-4 lg:px-8">
          <div class="mx-auto max-w-4xl">
            <button
              class="mb-8 inline-flex items-center gap-2 text-emerald-200 transition-colors hover:text-white"
              @click="goBack"
            >
              <span>⬅️</span>
              <span>返回首页</span>
            </button>

            <div class="flex items-center gap-4 mb-4">
              <span
                class="inline-flex items-center rounded-lg border border-emerald-300/30 bg-emerald-500/20 px-4 py-2"
              >
                <span class="text-2xl mr-2">🏷️</span>
                <span class="text-2xl font-bold">{{ tag.name }}</span>
              </span>
            </div>

            <div class="flex items-center gap-6 text-emerald-200 mt-6">
              <span class="flex items-center gap-2"> 📝 共 {{ tagPosts.length }} 篇文章 </span>
              <span class="flex items-center gap-2"> 📊 {{ tag.postCount }} 文章计数 </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 文章列表 -->
      <section class="py-12 lg:py-16">
        <div class="container mx-auto px-4 lg:px-8">
          <div class="mx-auto max-w-4xl">
            <!-- 空状态 -->
            <div v-if="tagPosts.length === 0" class="py-16 text-center">
              <div class="mx-auto mb-4 text-6xl">
                📄
              </div>
              <h3 class="mb-2 text-xl font-semibold text-slate-600">
                该标签下暂无文章
              </h3>
              <p class="text-slate-500 mb-8">
                敬请期待
              </p>
              <UButton color="primary" variant="outline" class="cursor-pointer" @click="goBack">
                🏠 返回首页
              </UButton>
            </div>

            <!-- 文章列表 -->
            <div v-else class="space-y-6">
              <NuxtLink
                v-for="post in tagPosts"
                :key="post.id"
                :to="`/posts/${post.slug}`"
                class="group block overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div class="flex flex-col md:flex-row md:items-start gap-4">
                  <div class="flex-1">
                    <div class="mb-3 flex items-center gap-2">
                      <span class="text-sm text-slate-500">
                        📅 {{ formatDateSimple(post.publishedAt || post.createdAt) }}
                      </span>
                      <span
                        class="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        📁 {{ post.category.name }}
                      </span>
                    </div>

                    <h3
                      class="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600"
                    >
                      {{ post.title }}
                    </h3>

                    <p class="mb-4 line-clamp-2 text-sm text-slate-600">
                      {{ post.excerpt }}
                    </p>

                    <div class="flex flex-wrap items-center gap-2 mb-4">
                      <span class="text-sm text-slate-500 mr-1">其他标签:</span>
                      <span
                        v-for="otherTag in post.tags?.filter((t: Tag) => t.id !== tag.id)"
                        :key="otherTag.id"
                        class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                      >
                        {{ otherTag.name }}
                      </span>
                    </div>

                    <div class="flex items-center justify-between">
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
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>

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

<script setup lang="ts">
import type { Category, Post } from '@blog/shared'
import { getCategoryBySlug, getPublishedPosts } from '@blog/shared'

const route = useRoute()
const router = useRouter()

const slug = computed(() => route.params.slug as string)

const { data: category, error } = await useAsyncData<Category | null>(`category-${slug.value}`, () => {
  const foundCategory = getCategoryBySlug(slug.value)
  return Promise.resolve(foundCategory || null)
})

const { data: allPosts } = await useAsyncData<Post[]>('category-posts', () => {
  return Promise.resolve(getPublishedPosts())
})

const categoryPosts = computed(() => {
  if (!category.value) return []
  return allPosts.value?.filter((p: Post) => p.category?.id === category.value?.id) || []
})

const notFound = computed(() => !category.value && !error.value)

useSeoMeta({
  title: computed(() =>
    category.value ? `${category.value.name} 分类文章 - TechBlog` : '分类未找到 - TechBlog',
  ),
  description: computed(() => category.value?.description || `查看 ${category.value?.name || ''} 分类下的所有技术文章`),
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
        📁
      </div>
      <h1 class="mb-4 text-3xl font-bold text-slate-900">
        分类未找到
      </h1>
      <p class="mb-8 text-slate-500">
        抱歉，您访问的分类不存在
      </p>
      <UButton color="primary" size="lg" class="cursor-pointer" @click="goBack">
        🏠 返回首页
      </UButton>
    </div>

    <!-- 分类文章列表 -->
    <div v-else-if="category" class="pb-16">
      <!-- 头部 Banner -->
      <section
        class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-16 text-white lg:py-20"
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
            <button
              class="mb-8 inline-flex items-center gap-2 text-blue-200 transition-colors hover:text-white"
              @click="goBack"
            >
              <span>⬅️</span>
              <span>返回首页</span>
            </button>

            <div class="flex items-center gap-4 mb-4">
              <span class="text-4xl">📁</span>
              <h1 class="text-3xl font-bold leading-tight lg:text-4xl">
                {{ category.name }}
              </h1>
            </div>
            
            <p v-if="category.description" class="mb-4 text-xl text-blue-100/80">
              {{ category.description }}
            </p>

            <div class="flex items-center gap-6 text-blue-200">
              <span class="flex items-center gap-2"> 📝 共 {{ categoryPosts.length }} 篇文章 </span>
              <span class="flex items-center gap-2"> 📊 {{ category.postCount }} 文章计数 </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 文章列表 -->
      <section class="py-12 lg:py-16">
        <div class="container mx-auto px-4 lg:px-8">
          <div class="mx-auto max-w-4xl">
            <!-- 空状态 -->
            <div v-if="categoryPosts.length === 0" class="py-16 text-center">
              <div class="mx-auto mb-4 text-6xl">
                📄
              </div>
              <h3 class="mb-2 text-xl font-semibold text-slate-600">
                该分类下暂无文章
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
                v-for="post in categoryPosts"
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
                        v-for="tag in post.tags?.slice(0, 2)"
                        :key="tag.id"
                        class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                      >
                        {{ tag.name }}
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

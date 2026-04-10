<script setup lang="ts">
import type { Post, Tag } from '@blog/shared'
import { getPublishedPostsByTagSlug, getTagBySlug } from '@blog/shared'

const route = useRoute()
const slug = route.params.slug as string

// 获取标签信息
const { data: tag } = await useAsyncData<Tag | undefined>(
  `tag-${slug}`,
  () => Promise.resolve(getTagBySlug(slug)),
)

// 获取标签下的文章
const { data: posts } = await useAsyncData<Post[]>(
  `tag-posts-${slug}`,
  () => Promise.resolve(getPublishedPostsByTagSlug(slug)),
)

// SEO
useSeoMeta({
  title: tag.value ? `#${tag.value.name} - 标签归档 - TechBlog` : '标签归档 - TechBlog',
  description: tag.value
    ? `查看 #${tag.value.name} 标签下的所有技术文章`
    : '查看 TechBlog 各标签下的技术文章',
})

// 格式化日期
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
    <!-- 标签标题区域 -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white"
    >
      <div class="container relative z-10 mx-auto px-4 py-12 lg:px-8 lg:py-16">
        <div class="mx-auto max-w-3xl text-center">
          <NuxtLink
            to="/"
            class="mb-4 inline-flex items-center gap-2 text-sm text-purple-200 hover:text-white"
          >
            ← 返回首页
          </NuxtLink>
          <h1 v-if="tag" class="mb-4 text-3xl font-bold lg:text-4xl">
            #️⃣ {{ tag.name }}
          </h1>
          <h1 v-else class="mb-4 text-3xl font-bold lg:text-4xl">
            标签未找到
          </h1>
          <p v-if="tag" class="text-lg text-purple-100/80">
            共 {{ posts?.length || 0 }} 篇文章标记为 #{{ tag.name }}
          </p>
          <p v-else class="text-lg text-purple-100/80">
            请检查标签 URL 是否正确
          </p>

          <div v-if="tag" class="mt-6 flex justify-center gap-8">
            <div
              class="rounded-xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm"
            >
              <div class="text-2xl font-bold text-white">
                {{ posts?.length || 0 }}
              </div>
              <div class="text-sm text-purple-200/70">
                文章数
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="py-12 lg:py-16">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="mb-8 flex items-center gap-2">
          <div class="h-6 w-1 rounded-full bg-purple-600" />
          <h2 class="text-2xl font-bold text-slate-900">
            文章列表
          </h2>
        </div>

        <!-- 空状态 -->
        <div v-if="!posts || posts.length === 0" class="py-16 text-center">
          <div class="mx-auto mb-4 text-6xl">
            📄
          </div>
          <h3 class="mb-2 text-xl font-semibold text-slate-600">
            该标签下暂无文章
          </h3>
          <p class="text-slate-500">
            敬请期待更多精彩内容
          </p>
        </div>

        <!-- 文章列表 -->
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

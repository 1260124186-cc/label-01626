<script setup lang="ts">
import type { Post } from '@blog/shared'
import { getPosts } from '@blog/shared'
import { computed, onMounted, ref } from 'vue'

const posts = ref<Post[]>([])

onMounted(() => {
  posts.value = getPosts()
})

const stats = computed(() => [
  {
    label: '文章总数',
    value: posts.value.length,
    icon: '📝',
    color: 'blue',
    bgColor: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100',
    iconBg: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    label: '已发布',
    value: posts.value.filter(p => p.status === 'published').length,
    icon: '✅',
    color: 'green',
    bgColor: 'bg-emerald-50',
    hoverBg: 'hover:bg-emerald-100',
    iconBg: 'bg-emerald-100',
    textColor: 'text-emerald-600',
  },
  {
    label: '草稿',
    value: posts.value.filter(p => p.status === 'draft').length,
    icon: '📄',
    color: 'yellow',
    bgColor: 'bg-amber-50',
    hoverBg: 'hover:bg-amber-100',
    iconBg: 'bg-amber-100',
    textColor: 'text-amber-600',
  },
  {
    label: '总浏览',
    value: posts.value.reduce((sum, p) => sum + p.viewCount, 0),
    icon: '👁️',
    color: 'purple',
    bgColor: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-100',
    iconBg: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
])

const quickActions = [
  {
    label: '新建文章',
    icon: '✏️',
    to: '/posts/create',
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
  },
  {
    label: '文章列表',
    icon: '📋',
    to: '/posts',
    color: 'indigo',
    bgGradient: 'from-indigo-500 to-indigo-600',
    hoverGradient: 'hover:from-indigo-600 hover:to-indigo-700',
  },
  {
    label: '查看博客',
    icon: '🌐',
    href: '/',
    target: '_blank',
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
    hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
  },
]
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900">
        仪表盘
      </h1>
      <p class="mt-1 text-slate-500">
        欢迎回来，管理员
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="transform cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
        :class="stat.hoverBg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">
              {{ stat.label }}
            </p>
            <p class="mt-2 text-3xl font-bold text-slate-900">
              {{ stat.value }}
            </p>
          </div>
          <div
            class="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
            :class="stat.iconBg"
          >
            {{ stat.icon }}
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="mb-6 text-lg font-semibold text-slate-900">
        快捷操作
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <template v-for="action in quickActions" :key="action.label">
          <!-- 内部链接 -->
          <router-link
            v-if="action.to"
            :to="action.to"
            class="group relative transform overflow-hidden rounded-xl bg-gradient-to-r p-6 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            :class="[action.bgGradient, action.hoverGradient]"
          >
            <div
              class="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"
            />
            <div class="relative flex flex-col items-center text-center">
              <span class="mb-3 text-4xl">{{ action.icon }}</span>
              <span class="text-lg font-semibold">{{ action.label }}</span>
            </div>
          </router-link>

          <!-- 外部链接 -->
          <a
            v-else
            :href="action.href"
            :target="action.target"
            class="group relative transform overflow-hidden rounded-xl bg-gradient-to-r p-6 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            :class="[action.bgGradient, action.hoverGradient]"
          >
            <div
              class="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"
            />
            <div class="relative flex flex-col items-center text-center">
              <span class="mb-3 text-4xl">{{ action.icon }}</span>
              <span class="text-lg font-semibold">{{ action.label }}</span>
            </div>
          </a>
        </template>
      </div>
    </div>

    <!-- 最近文章 -->
    <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900">
          最近文章
        </h2>
      </div>
      <div class="divide-y divide-slate-200">
        <div
          v-for="post in posts.slice(0, 5)"
          :key="post.id"
          class="flex items-center justify-between p-4 hover:bg-slate-50"
        >
          <div>
            <p class="font-medium text-slate-900">
              {{ post.title }}
            </p>
            <p class="text-sm text-slate-500">
              {{ post.category.name }}
            </p>
          </div>
          <span
            class="rounded-md px-2 py-1 text-xs font-medium"
            :class="
              post.status === 'published'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            "
          >
            {{ post.status === 'published' ? '已发布' : '草稿' }}
          </span>
        </div>
        <div v-if="posts.length === 0" class="p-8 text-center text-slate-500">
          暂无文章
        </div>
      </div>
    </div>
  </div>
</template>

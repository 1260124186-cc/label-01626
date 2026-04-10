<script setup lang="ts">
import { ref } from 'vue'

const navLinks = [
  { label: '🏠 首页', to: '/' },
  { label: '📖 关于', to: '/about' },
]

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 切换移动端菜单
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 关闭移动端菜单
function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <!-- 导航栏 -->
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div class="container mx-auto px-4 lg:px-8">
        <nav class="flex h-16 items-center justify-between lg:h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="group flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-shadow group-hover:shadow-blue-500/50"
            >
              <span class="font-bold text-white">TB</span>
            </div>
            <span class="text-xl font-bold text-slate-900">TechBlog</span>
          </NuxtLink>

          <!-- 桌面端导航链接 -->
          <div class="hidden items-center gap-1 rounded-full bg-slate-100 p-1.5 md:flex">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:text-slate-900"
              active-class="!text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- 移动端菜单按钮 -->
          <button
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 md:hidden"
            aria-label="切换菜单"
            @click="toggleMobileMenu"
          >
            <svg
              v-if="!isMobileMenuOpen"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </nav>

        <!-- 移动端下拉菜单 -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="isMobileMenuOpen" class="border-t border-slate-200 py-4 md:hidden">
            <div class="flex flex-col gap-2">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="rounded-lg px-4 py-3 font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                active-class="!text-white !bg-gradient-to-r from-blue-500 to-indigo-600"
                @click="closeMobileMenu"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="mt-auto bg-slate-900 text-white">
      <div class="container mx-auto px-4 lg:px-8">
        <!-- 主要内容 -->
        <div class="grid grid-cols-1 gap-12 py-12 md:grid-cols-2">
          <!-- 品牌信息 -->
          <div>
            <div class="mb-6 flex items-center gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"
              >
                <span class="text-lg font-bold text-white">TB</span>
              </div>
              <div>
                <span class="block text-xl font-bold">TechBlog</span>
                <span class="text-sm text-slate-400">技术博客平台</span>
              </div>
            </div>
            <p class="leading-relaxed text-slate-400">
              一个现代化的技术博客平台，分享前端、后端、DevOps 等技术文章，帮助开发者成长。
            </p>
          </div>

          <!-- 快速链接 -->
          <div>
            <h4 class="mb-6 text-lg font-bold">
              🔗 快速链接
            </h4>
            <ul class="space-y-3">
              <li v-for="link in navLinks" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  class="group flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full bg-slate-600 transition-colors group-hover:bg-blue-500"
                  />
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- 版权信息 -->
        <div
          class="flex flex-col items-center justify-between gap-4 border-t border-slate-800 py-6 md:flex-row"
        >
          <p class="text-sm text-slate-500">
            © {{ new Date().getFullYear() }} TechBlog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

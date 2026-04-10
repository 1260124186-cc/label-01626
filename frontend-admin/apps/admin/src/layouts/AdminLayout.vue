<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isSidebarOpen = ref(true)
const isUserMenuOpen = ref(false)

const menuItems = [
  { path: '/', icon: '📊', label: '仪表盘', name: 'dashboard', matchNames: ['dashboard'] },
  {
    path: '/posts',
    icon: '📝',
    label: '文章管理',
    name: 'posts',
    matchNames: ['posts', 'post-create', 'post-edit'],
  },
  {
    path: '/categories',
    icon: '📂',
    label: '分类管理',
    name: 'categories',
    matchNames: ['categories'],
  },
  {
    path: '/tags',
    icon: '🏷️',
    label: '标签管理',
    name: 'tags',
    matchNames: ['tags'],
  },
]

// 检查菜单项是否激活
function isMenuActive(item: (typeof menuItems)[0]) {
  const currentRouteName = route.name as string
  return item.matchNames.includes(currentRouteName)
}

// 管理员信息
const adminInfo = {
  name: '管理员',
  avatar: 'https://picsum.photos/seed/admin/100/100',
  email: 'admin@techblog.com',
}

// 退出登录
function handleLogout() {
  // 清除登录状态
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('adminToken')
  // 跳转到登录页
  router.push('/login')
}

// 点击外部关闭菜单
function closeUserMenu() {
  isUserMenuOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-100">
    <!-- 侧边栏 -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 lg:static"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white"
          >
            TB
          </div>
          <span class="font-semibold text-slate-900">管理后台</span>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="space-y-1 p-4">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
          :class="
            isMenuActive(item) ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
          "
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span class="font-medium">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- 底部链接 -->
      <div class="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
        <a
          href="/"
          target="_blank"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100"
        >
          <span class="text-lg">🌐</span>
          <span class="font-medium">访问博客</span>
        </a>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- 顶部导航 -->
      <header
        class="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8"
      >
        <button
          class="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 lg:hidden"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          ☰
        </button>
        <div class="flex-1" />

        <!-- 管理员头像和下拉菜单 -->
        <div class="relative">
          <button
            class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-100"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <img
              :src="adminInfo.avatar"
              :alt="adminInfo.name"
              class="h-8 w-8 rounded-full border-2 border-slate-200 object-cover"
            >
            <span class="hidden text-sm font-medium text-slate-700 sm:inline">
              {{ adminInfo.name }}
            </span>
            <svg
              class="h-4 w-4 text-slate-400 transition-transform"
              :class="{ 'rotate-180': isUserMenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- 下拉菜单 -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
            >
              <!-- 用户信息 -->
              <div class="border-b border-slate-200 px-4 py-3">
                <p class="text-sm font-medium text-slate-900">
                  {{ adminInfo.name }}
                </p>
                <p class="truncate text-sm text-slate-500">
                  {{ adminInfo.email }}
                </p>
              </div>

              <!-- 退出登录按钮 -->
              <button
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                @click="handleLogout"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                退出登录
              </button>
            </div>
          </Transition>
        </div>
      </header>

      <!-- 点击外部关闭用户菜单 -->
      <div v-if="isUserMenuOpen" class="fixed inset-0 z-30" @click="closeUserMenu" />

      <!-- 页面内容 -->
      <main class="flex-1 p-4 lg:p-8">
        <RouterView />
      </main>
    </div>

    <!-- 移动端遮罩 -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="isSidebarOpen = false"
    />
  </div>
</template>

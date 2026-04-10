<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  password: '',
  remember: false,
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(false)
const showPassword = ref(false)

// 验证表单
function validate() {
  errors.value = {}

  if (!form.value.username.trim()) {
    errors.value.username = '请输入用户名'
  }

  if (!form.value.password.trim()) {
    errors.value.password = '请输入密码'
  }
  else if (form.value.password.length < 6) {
    errors.value.password = '密码长度至少6位'
  }

  return Object.keys(errors.value).length === 0
}

// 登录处理
async function handleLogin() {
  if (!validate())
    return

  isLoading.value = true

  try {
    // 模拟登录验证（实际项目中应调用 API）
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 简单的验证逻辑（演示用）
    if (form.value.username === 'admin' && form.value.password === 'admin123') {
      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('adminToken', `mock-token-${Date.now()}`)

      // 跳转到仪表盘
      router.push('/')
    }
    else {
      errors.value.general = '用户名或密码错误'
    }
  }
  catch {
    errors.value.general = '登录失败，请稍后重试'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div class="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
    </div>

    <!-- 登录卡片 -->
    <div class="relative w-full max-w-md">
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <!-- Logo 和标题 -->
        <div class="mb-8 text-center">
          <div
            class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white"
          >
            TB
          </div>
          <h1 class="text-2xl font-bold text-slate-900">
            管理后台
          </h1>
          <p class="mt-2 text-slate-500">
            请登录您的账户
          </p>
        </div>

        <!-- 错误提示 -->
        <div v-if="errors.general" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p class="flex items-center gap-2 text-sm text-red-600">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ errors.general }}
          </p>
        </div>

        <!-- 登录表单 -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- 用户名 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700"> 用户名 </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                class="w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.username ? 'border-red-500' : 'border-slate-300'"
              >
            </div>
            <p v-if="errors.username" class="mt-2 text-sm text-red-500">
              {{ errors.username }}
            </p>
          </div>

          <!-- 密码 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700"> 密码 </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="w-full rounded-lg border bg-white py-3 pl-10 pr-12 text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.password ? 'border-red-500' : 'border-slate-300'"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                @click="showPassword = !showPassword"
              >
                <svg
                  v-if="showPassword"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-500">
              {{ errors.password }}
            </p>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            <svg v-if="isLoading" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ isLoading ? '登录中...' : '登 录' }}
          </button>
        </form>
      </div>

      <!-- 底部版权 -->
      <p class="mt-6 text-center text-sm text-slate-400">
        © 2024 TechBlog. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { provide, ref } from 'vue'

interface Toast {
  id: string
  title: string
  description?: string
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'info'
}

const toasts = ref<Toast[]>([])

function add(toast: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).slice(2)
  toasts.value.push({ ...toast, id })
  setTimeout(() => remove(id), 3000)
}

function remove(id: string) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1)
    toasts.value.splice(index, 1)
}

provide('toast', { add })

function getIcon(color?: string) {
  switch (color) {
    case 'green':
      return 'heroicons:check-circle'
    case 'red':
      return 'heroicons:x-circle'
    case 'yellow':
      return 'heroicons:exclamation-triangle'
    case 'info':
      return 'heroicons:information-circle'
    default:
      return 'heroicons:information-circle'
  }
}

function getColorClasses(color?: string) {
  switch (color) {
    case 'green':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    case 'red':
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    case 'yellow':
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    case 'info':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    default:
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  }
}

function getIconColor(color?: string) {
  switch (color) {
    case 'green':
      return 'text-green-500'
    case 'red':
      return 'text-red-500'
    case 'yellow':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    default:
      return 'text-blue-500'
  }
}

// 暴露 add 方法给外部使用
defineExpose({ add })
</script>

<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-50 space-y-2">
      <TransitionGroup
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg"
          :class="[getColorClasses(toast.color)]"
        >
          <Icon
            :icon="getIcon(toast.color)"
            class="h-5 w-5 flex-shrink-0"
            :class="[getIconColor(toast.color)]"
          />
          <div class="min-w-0 flex-1">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ toast.title }}
            </p>
            <p v-if="toast.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ toast.description }}
            </p>
          </div>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="remove(toast.id)"
          >
            <Icon icon="heroicons:x-mark" class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
  <slot />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, onUnmounted, ref } from 'vue'

interface MenuItem {
  label: string
  icon?: string
  click?: () => void
}

interface Props {
  items: MenuItem[][]
}

defineProps<Props>()

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

function handleClick(item: MenuItem) {
  item.click?.()
  isOpen.value = false
}

// 点击外部关闭
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.dropdown-menu')) {
    isOpen.value = false
  }
}

// 转换图标名称
function convertIconName(name: string) {
  if (name.startsWith('i-heroicons-')) {
    return name.replace('i-heroicons-', 'heroicons:')
  }
  return name
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="dropdown-menu relative">
    <div @click="toggle">
      <slot />
    </div>

    <Transition
      enter-active-class="duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          v-for="(group, groupIndex) in items"
          :key="groupIndex"
          :class="groupIndex > 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''"
        >
          <button
            v-for="item in group"
            :key="item.label"
            type="button"
            class="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="handleClick(item)"
          >
            <Icon v-if="item.icon" :icon="convertIconName(item.icon)" class="h-4 w-4" />
            {{ item.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

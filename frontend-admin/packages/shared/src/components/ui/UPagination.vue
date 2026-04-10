<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface Props {
  total: number
  defaultPage?: number
  itemsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  defaultPage: 1,
  itemsPerPage: 10,
})

const currentPage = defineModel<number>('page', { default: 1 })

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage))

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  }
  else {
    pages.push(1)
    if (current > 3)
      pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2)
      pages.push('...')
    pages.push(total)
  }

  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <nav class="flex items-center gap-1">
    <button
      :disabled="currentPage <= 1"
      class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
      @click="goToPage(currentPage - 1)"
    >
      <Icon icon="heroicons:chevron-left" class="h-4 w-4" />
    </button>

    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === '...'" class="px-2 text-gray-400">...</span>
      <button
        v-else
        class="h-8 min-w-[32px] rounded-lg px-2 text-sm font-medium transition-colors"
        :class="
          page === currentPage
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        "
        @click="goToPage(page as number)"
      >
        {{ page }}
      </button>
    </template>

    <button
      :disabled="currentPage >= totalPages"
      class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
      @click="goToPage(currentPage + 1)"
    >
      <Icon icon="heroicons:chevron-right" class="h-4 w-4" />
    </button>
  </nav>
</template>

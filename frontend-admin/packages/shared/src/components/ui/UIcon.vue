<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  name: string
}

defineProps<Props>()

// 转换 heroicons 格式到 iconify 格式
function convertIconName(name: string) {
  // i-heroicons-xxx -> heroicons:xxx
  if (name.startsWith('i-heroicons-')) {
    return name.replace('i-heroicons-', 'heroicons:')
  }
  return name
}
</script>

<template>
  <Icon :icon="convertIconName(name)" />
</template>

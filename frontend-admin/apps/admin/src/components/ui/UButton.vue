<script setup lang="ts">
defineProps<{
  color?: 'primary' | 'neutral' | 'red'
  variant?: 'solid' | 'outline' | 'soft'
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'bg-blue-600 text-white hover:bg-blue-700':
        color === 'primary' && variant !== 'outline' && variant !== 'soft',
      'bg-slate-600 text-white hover:bg-slate-700':
        color === 'neutral' && variant !== 'outline' && variant !== 'soft',
      'bg-red-600 text-white hover:bg-red-700':
        color === 'red' && variant !== 'outline' && variant !== 'soft',
      'border border-slate-300 text-slate-700 hover:bg-slate-100': variant === 'outline',
      'bg-red-100 text-red-700 hover:bg-red-200': color === 'red' && variant === 'soft',
    }"
  >
    <span v-if="loading" class="animate-spin">⏳</span>
    <slot />
  </button>
</template>

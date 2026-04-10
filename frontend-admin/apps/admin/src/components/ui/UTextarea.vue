<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
  rows?: number
  color?: 'red'
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows || 4"
    class="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
    :class="{
      'border-red-500 focus:ring-red-500': color === 'red',
    }"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'red'
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="relative">
    <span v-if="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"> 🔍 </span>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="[
        icon ? 'pl-10 pr-4' : 'px-4',
        size === 'sm' ? 'h-8 text-sm' : size === 'lg' ? 'h-12 text-base' : 'h-10 text-sm',
        color === 'red' ? 'border-red-500 focus:ring-red-500' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>

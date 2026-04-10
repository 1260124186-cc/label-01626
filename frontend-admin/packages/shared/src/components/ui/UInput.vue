<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  color: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  if (props.color === 'red') {
    return 'border-red-500 focus:border-red-500 focus:ring-red-500'
  }
  return 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
})

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}

// 转换图标名称
function convertIconName(name: string) {
  if (name.startsWith('i-heroicons-')) {
    return name.replace('i-heroicons-', 'heroicons:')
  }
  return name
}
</script>

<template>
  <div class="relative">
    <Icon
      v-if="icon"
      :icon="convertIconName(icon)"
      class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
    />
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      class="w-full rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
      :class="[sizeClasses, colorClasses, icon ? 'pl-10' : '']"
      @input="handleInput"
    >
  </div>
</template>

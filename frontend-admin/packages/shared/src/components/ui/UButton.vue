<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface Props {
  color?: 'primary' | 'neutral' | 'red' | 'green' | 'yellow' | 'orange' | 'indigo' | 'white'
  variant?: 'solid' | 'outline' | 'ghost' | 'soft'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: string
  trailingIcon?: string
  loading?: boolean
  disabled?: boolean
  block?: boolean
  to?: string
  target?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
})

const baseClasses
    = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    primary: {
      solid: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline:
          'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
      ghost: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
      soft: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 focus:ring-blue-500',
    },
    neutral: {
      solid: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline:
          'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500',
      ghost:
          'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500',
      soft: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
    },
    red: {
      solid: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      outline:
          'border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500',
      ghost: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500',
      soft: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 focus:ring-red-500',
    },
    green: {
      solid: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      outline:
          'border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500',
      ghost: 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500',
      soft: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 focus:ring-green-500',
    },
    yellow: {
      solid: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
      outline:
          'border border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 focus:ring-yellow-500',
      ghost:
          'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 focus:ring-yellow-500',
      soft: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 focus:ring-yellow-500',
    },
    orange: {
      solid: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
      outline:
          'border border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:ring-orange-500',
      ghost:
          'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:ring-orange-500',
      soft: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 focus:ring-orange-500',
    },
    indigo: {
      solid: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      outline:
          'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:ring-indigo-500',
      ghost:
          'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:ring-indigo-500',
      soft: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 focus:ring-indigo-500',
    },
    white: {
      solid: 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-white',
      outline: 'border border-white text-white hover:bg-white/10 focus:ring-white',
      ghost: 'text-white hover:bg-white/10 focus:ring-white',
      soft: 'bg-white/20 text-white hover:bg-white/30 focus:ring-white',
    },
  }
  return colors[props.color][props.variant]
})

const classes = computed(() => [
  baseClasses,
  sizeClasses.value,
  colorClasses.value,
  props.block ? 'w-full' : '',
])

const isLink = computed(() => !!props.to)
const component = computed(() => (isLink.value ? 'a' : 'button'))

// 转换图标名称
function convertIconName(name: string) {
  if (name.startsWith('i-heroicons-')) {
    return name.replace('i-heroicons-', 'heroicons:')
  }
  return name
}
</script>

<template>
  <component
    :is="component"
    :href="to"
    :target="target"
    :disabled="disabled || loading"
    :class="classes"
  >
    <Icon v-if="loading" icon="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
    <Icon v-else-if="icon" :icon="convertIconName(icon)" class="h-4 w-4" />
    <slot />
    <Icon v-if="trailingIcon && !loading" :icon="convertIconName(trailingIcon)" class="h-4 w-4" />
  </component>
</template>

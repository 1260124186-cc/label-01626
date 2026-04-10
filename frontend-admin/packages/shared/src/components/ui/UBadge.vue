<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?:
    | 'primary'
    | 'neutral'
    | 'red'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'indigo'
    | 'gray'
    | 'blue'
  variant?: 'solid' | 'subtle'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'subtle',
  size: 'md',
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    primary: {
      solid: 'bg-blue-600 text-white',
      subtle: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    blue: {
      solid: 'bg-blue-600 text-white',
      subtle: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    neutral: {
      solid: 'bg-gray-600 text-white',
      subtle: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    },
    gray: {
      solid: 'bg-gray-600 text-white',
      subtle: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    },
    red: {
      solid: 'bg-red-600 text-white',
      subtle: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    green: {
      solid: 'bg-green-600 text-white',
      subtle: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    yellow: {
      solid: 'bg-yellow-500 text-white',
      subtle: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    orange: {
      solid: 'bg-orange-600 text-white',
      subtle: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
    indigo: {
      solid: 'bg-indigo-600 text-white',
      subtle: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
  }
  return colors[props.color][props.variant]
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-medium"
    :class="[sizeClasses, colorClasses]"
  >
    <slot />
  </span>
</template>

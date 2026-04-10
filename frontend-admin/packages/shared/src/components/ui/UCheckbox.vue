<script setup lang="ts">
interface Props {
  modelValue?: boolean
  disabled?: boolean
  indeterminate?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <input
    type="checkbox"
    :checked="modelValue"
    :disabled="disabled"
    :indeterminate="indeterminate"
    class="h-4 w-4 cursor-pointer rounded border-gray-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800"
    @change="handleChange"
  >
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: boolean
  indeterminate?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <input
    type="checkbox"
    :checked="modelValue"
    :indeterminate="indeterminate"
    class="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
  >
</template>

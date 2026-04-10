<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface SelectItem {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  items: SelectItem[]
  placeholder?: string
  valueKey?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  valueKey: 'value',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen = ref(false)

const selectedLabel = computed(() => {
  const item = props.items.find(i => i.value === props.modelValue)
  return item?.label || props.placeholder
})

function select(item: SelectItem) {
  emit('update:modelValue', item.value)
  isOpen.value = false
}

function toggle() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

// 点击外部关闭
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.select-menu')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="select-menu relative">
    <button
      type="button"
      :disabled="disabled"
      class="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      @click="toggle"
    >
      <span :class="modelValue ? '' : 'text-gray-400'">{{ selectedLabel }}</span>
      <Icon
        icon="heroicons:chevron-down"
        class="h-4 w-4 text-gray-400 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>

    <Transition
      enter-active-class="duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <button
          v-for="item in items"
          :key="item.value"
          type="button"
          class="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="
            item.value === modelValue
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300'
          "
          @click="select(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Item {
  label: string
  value: string
  disabled?: boolean
  icon?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    items: Item[]
    valueKey?: string
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    placeholder: '请选择',
    disabled: false,
    clearable: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const highlightedIndex = ref(-1)

// 当前选中项
const selectedItem = computed(() => {
  return props.items.find(item => item.value === props.modelValue)
})

// 显示的文本
const displayText = computed(() => {
  return selectedItem.value?.label || ''
})

// 切换下拉框
function toggleDropdown() {
  if (props.disabled)
    return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    highlightedIndex.value = props.items.findIndex(item => item.value === props.modelValue)
  }
}

// 选择选项
function selectOption(item: Item) {
  if (item.disabled)
    return
  emit('update:modelValue', item.value)
  emit('change', item.value)
  isOpen.value = false
}

// 清除选择
function clearSelection(e: Event) {
  e.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
}

// 键盘导航
function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      isOpen.value = true
      highlightedIndex.value = 0
    }
    return
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.items.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      if (highlightedIndex.value >= 0 && props.items[highlightedIndex.value]) {
        selectOption(props.items[highlightedIndex.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      isOpen.value = false
      break
  }
}

// 点击外部关闭
function handleClickOutside(e: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

// 尺寸样式
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 text-sm px-3'
    case 'lg':
      return 'h-12 text-base px-4'
    default:
      return 'h-10 text-sm px-3'
  }
})

const dropdownItemSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'py-1.5 px-3 text-sm'
    case 'lg':
      return 'py-3 px-4 text-base'
    default:
      return 'py-2 px-3 text-sm'
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="selectRef" class="relative">
    <!-- 选择器触发器 -->
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-lg border bg-white transition-all duration-200"
      :class="[
        sizeClasses,
        disabled
          ? 'cursor-not-allowed border-slate-200 opacity-60'
          : isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-slate-300 hover:border-blue-400',
      ]"
      :disabled="disabled"
      @click="toggleDropdown"
      @keydown="handleKeydown"
    >
      <span
        class="flex-1 truncate text-left"
        :class="displayText ? 'text-slate-900' : 'text-slate-400'"
      >
        {{ displayText || placeholder }}
      </span>

      <div class="ml-2 flex items-center gap-1">
        <!-- 清除按钮 -->
        <span
          v-if="clearable && modelValue && !disabled"
          class="flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          @click="clearSelection"
        >
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>

        <!-- 下拉箭头 -->
        <svg
          class="h-4 w-4 text-slate-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </button>

    <!-- 下拉菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95 -translate-y-1"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
      >
        <div
          v-for="(item, index) in items"
          :key="item.value"
          class="flex cursor-pointer items-center transition-colors"
          :class="[
            dropdownItemSize,
            item.disabled
              ? 'cursor-not-allowed opacity-50'
              : highlightedIndex === index
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-slate-50',
            item.value === modelValue && !item.disabled
              ? 'font-medium text-blue-600'
              : 'text-slate-700',
          ]"
          @click="selectOption(item)"
          @mouseenter="highlightedIndex = index"
        >
          <!-- 选中图标 -->
          <span class="mr-2 w-5 flex-shrink-0">
            <svg
              v-if="item.value === modelValue"
              class="h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>

          <!-- 选项图标 -->
          <span v-if="item.icon" class="mr-2">{{ item.icon }}</span>

          <!-- 选项文本 -->
          <span class="flex-1 truncate">{{ item.label }}</span>
        </div>

        <!-- 空状态 -->
        <div v-if="items.length === 0" class="py-6 text-center text-sm text-slate-400">
          暂无选项
        </div>
      </div>
    </Transition>
  </div>
</template>

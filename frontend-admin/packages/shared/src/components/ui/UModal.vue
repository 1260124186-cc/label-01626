<script setup lang="ts">
import { onUnmounted, watch } from 'vue'

interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function close() {
  emit('update:open', false)
}

// 按 ESC 关闭
let removeListener: (() => void) | null = null

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape')
          close()
      }
      document.addEventListener('keydown', handleEsc)
      removeListener = () => document.removeEventListener('keydown', handleEsc)
    }
    else if (removeListener) {
      removeListener()
      removeListener = null
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (removeListener) {
    removeListener()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="close" />

        <!-- Modal content -->
        <Transition
          enter-active-class="duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            class="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white shadow-xl dark:bg-gray-800"
          >
            <slot name="content" />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

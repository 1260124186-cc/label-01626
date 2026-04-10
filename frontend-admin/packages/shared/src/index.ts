export * from './composables'
export * from './constants'
export * from './data'
// 统一导出所有模块
export * from './types'
export * from './utils'

// 重新导出 @vueuse/core 常用功能，避免子项目重复依赖
export {
  onClickOutside,
  useBreakpoints,
  useClipboard,
  useColorMode,
  useDark,
  useDebounce,
  useEventListener,
  useFetch,
  useIntersectionObserver,
  useLocalStorage,
  useMediaQuery,
  useMouse,
  useScroll,
  useSessionStorage,
  useThrottle,
  useToggle,
  useWindowSize,
} from '@vueuse/core'

// 重新导出 marked，避免子项目重复依赖
export { marked } from 'marked'

// 重新导出 vue 常用功能，避免子项目重复依赖
export {
  computed,
  type ComputedRef,
  defineComponent,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  type PropType,
  reactive,
  ref,
  type Ref,
  watch,
  watchEffect,
} from 'vue'

// 重新导出 vue-router 常用功能，避免子项目重复依赖
export {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type NavigationGuard,
  type RouteLocationNormalized,
  type RouteLocationRaw,
  type Router,
  useRoute,
  useRouter,
} from 'vue-router'

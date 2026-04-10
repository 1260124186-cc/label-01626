import type { ToastOptions, User } from '../types'
import { useDark, useEventListener, useLocalStorage, useToggle } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { STORAGE_KEYS } from '../constants'
import { type AppError, handleError, normalizeError } from '../utils/error'
import { createLogger } from '../utils/logger'
import { type FormValidation, validateForm, type ValidationResult } from '../utils/validator'

const logger = createLogger('composables')

/**
 * Toast 通知 composable
 */
export function useToast() {
  const toasts = ref<(ToastOptions & { id: string })[]>([])

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const show = (options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2)
    const toast = { ...options, id }
    toasts.value.push(toast)

    const duration = options.duration ?? 3000
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const success = (title: string, message?: string) => show({ type: 'success', title, message })

  const error = (title: string, message?: string) => show({ type: 'error', title, message })

  const warning = (title: string, message?: string) => show({ type: 'warning', title, message })

  const info = (title: string, message?: string) => show({ type: 'info', title, message })

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
  }
}

/**
 * 主题切换 composable
 */
export function useTheme() {
  const isDark = useDark({
    storageKey: STORAGE_KEYS.theme,
    valueDark: 'dark',
    valueLight: 'light',
  })
  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark,
  }
}

/**
 * 用户认证 composable
 */
export function useAuth() {
  const token = useLocalStorage<string | null>(STORAGE_KEYS.token, null)
  const user = useLocalStorage<User | null>(STORAGE_KEYS.user, null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    setAuth,
    clearAuth,
  }
}

/**
 * 加载状态 composable
 */
export function useLoading(initialState = false) {
  const isLoading = ref(initialState)

  const startLoading = () => {
    isLoading.value = true
  }

  const stopLoading = () => {
    isLoading.value = false
  }

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    startLoading()
    try {
      return await fn()
    }
    finally {
      stopLoading()
    }
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
}

/**
 * 分页 composable
 */
export function usePagination(initialPage = 1, initialPageSize = 10) {
  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasNextPage = computed(() => page.value < totalPages.value)
  const hasPrevPage = computed(() => page.value > 1)

  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      page.value--
    }
  }

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages.value) {
      page.value = p
    }
  }

  const setTotal = (t: number) => {
    total.value = t
  }

  const reset = () => {
    page.value = initialPage
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    setTotal,
    reset,
  }
}

/**
 * 搜索 composable
 */
export function useSearch(debounceMs = 300) {
  const searchQuery = ref('')
  const debouncedQuery = ref('')
  let timer: ReturnType<typeof setTimeout> | null = null

  const setQuery = (query: string) => {
    searchQuery.value = query
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedQuery.value = query
    }, debounceMs)
  }

  const clearQuery = () => {
    searchQuery.value = ''
    debouncedQuery.value = ''
    if (timer)
      clearTimeout(timer)
  }

  return {
    searchQuery,
    debouncedQuery,
    setQuery,
    clearQuery,
  }
}

/**
 * 确认对话框 composable
 */
export function useConfirm() {
  const isOpen = ref(false)
  const title = ref('')
  const message = ref('')
  const resolvePromise = ref<((value: boolean) => void) | null>(null)

  const confirm = (t: string, m: string): Promise<boolean> => {
    title.value = t
    message.value = m
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise.value = resolve
    })
  }

  const handleConfirm = () => {
    isOpen.value = false
    resolvePromise.value?.(true)
    resolvePromise.value = null
  }

  const handleCancel = () => {
    isOpen.value = false
    resolvePromise.value?.(false)
    resolvePromise.value = null
  }

  return {
    isOpen,
    title,
    message,
    confirm,
    handleConfirm,
    handleCancel,
  }
}

/**
 * 表单处理 composable
 */
export function useForm<T extends Record<string, unknown>>(
  initialData: T,
  validation?: FormValidation<T>,
) {
  const formData = ref<T>({ ...initialData }) as { value: T }
  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)
  const isDirty = ref(false)

  // 监听表单变化
  watch(
    formData,
    () => {
      isDirty.value = true
    },
    { deep: true },
  )

  // 设置字段值
  const setField = <K extends keyof T>(field: K, value: T[K]) => {
    formData.value[field] = value
    // 清除该字段的错误
    if (errors.value[field as string]) {
      delete errors.value[field as string]
    }
  }

  // 设置多个字段
  const setFields = (fields: Partial<T>) => {
    Object.assign(formData.value, fields)
  }

  // 重置表单
  const reset = () => {
    formData.value = { ...initialData }
    errors.value = {}
    isDirty.value = false
  }

  // 校验表单
  const validate = async (): Promise<ValidationResult> => {
    if (!validation) {
      return { valid: true, errors: [] }
    }

    const result = await validateForm(formData.value, validation)

    // 更新错误状态
    errors.value = {}
    result.errors.forEach((err) => {
      errors.value[err.field] = err.message
    })

    return result
  }

  // 校验单个字段
  const validateField = async (field: keyof T): Promise<string | null> => {
    if (!validation || !validation[field]) {
      return null
    }

    const fieldData = { [field]: formData.value[field] } as unknown as T
    const fieldValidation = { [field]: validation[field] } as unknown as FormValidation<T>
    const result = await validateForm(fieldData, fieldValidation)

    if (result.errors.length > 0 && result.errors[0]) {
      errors.value[field as string] = result.errors[0].message
      return result.errors[0].message
    }

    delete errors.value[field as string]
    return null
  }

  // 提交表单
  const handleSubmit = async (
    onSubmit: (data: T) => Promise<void>,
    onError?: (error: AppError) => void,
  ) => {
    isSubmitting.value = true
    logger.debug('Form submission started', formData.value)

    try {
      // 先校验
      const result = await validate()
      if (!result.valid) {
        logger.warn('Form validation failed', result.errors)
        return
      }

      await onSubmit(formData.value)
      logger.info('Form submitted successfully')
    }
    catch (error) {
      const appError = normalizeError(error)
      logger.error('Form submission failed', appError)

      if (onError) {
        onError(appError)
      }
      else {
        handleError(appError)
      }
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    isDirty,
    setField,
    setFields,
    reset,
    validate,
    validateField,
    handleSubmit,
  }
}

/**
 * 异步数据请求 composable
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: {
    immediate?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: AppError) => void
  } = {},
) {
  const { immediate = true, onSuccess, onError } = options

  const data = ref<T | null>(null) as { value: T | null }
  const error = ref<AppError | null>(null)
  const isLoading = ref(false)
  const isReady = ref(false)

  const execute = async () => {
    isLoading.value = true
    error.value = null
    logger.debug('Fetching data...')

    try {
      const result = await fetcher()
      data.value = result
      isReady.value = true
      logger.debug('Data fetched successfully', result)
      onSuccess?.(result)
    }
    catch (err) {
      const appError = normalizeError(err)
      error.value = appError
      logger.error('Data fetch failed', appError)
      onError?.(appError)
    }
    finally {
      isLoading.value = false
    }
  }

  const refresh = () => execute()

  if (immediate) {
    onMounted(execute)
  }

  return {
    data,
    error,
    isLoading,
    isReady,
    execute,
    refresh,
  }
}

/**
 * 列表数据管理 composable
 */
export function useList<T extends { id: number | string }>(
  fetcher: (params: { page: number, pageSize: number, search?: string }) => Promise<{
    items: T[]
    total: number
  }>,
) {
  const items = ref<T[]>([]) as { value: T[] }
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)

  const pagination = usePagination()
  const search = useSearch()

  // 加载数据
  const load = async () => {
    isLoading.value = true
    error.value = null

    try {
      const result = await fetcher({
        page: pagination.page.value,
        pageSize: pagination.pageSize.value,
        search: search.debouncedQuery.value || undefined,
      })

      items.value = result.items
      pagination.setTotal(result.total)
      logger.debug('List loaded', { count: result.items.length, total: result.total })
    }
    catch (err) {
      const appError = normalizeError(err)
      error.value = appError
      logger.error('List load failed', appError)
    }
    finally {
      isLoading.value = false
    }
  }

  // 刷新
  const refresh = () => {
    pagination.reset()
    return load()
  }

  // 删除项
  const removeItem = (id: number | string) => {
    items.value = items.value.filter(item => item.id !== id)
    pagination.setTotal(pagination.total.value - 1)
  }

  // 更新项
  const updateItem = (id: number | string, updates: Partial<T>) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1 && items.value[index]) {
      items.value[index] = { ...items.value[index], ...updates } as T
    }
  }

  // 添加项
  const addItem = (item: T) => {
    items.value.unshift(item)
    pagination.setTotal(pagination.total.value + 1)
  }

  // 监听分页和搜索变化
  watch([pagination.page, pagination.pageSize], load)
  watch(search.debouncedQuery, () => {
    pagination.reset()
    load()
  })

  return {
    items,
    isLoading,
    error,
    pagination,
    search,
    load,
    refresh,
    removeItem,
    updateItem,
    addItem,
  }
}

/**
 * 键盘快捷键 composable
 */
export function useKeyboard(shortcuts: Record<string, () => void>) {
  const handleKeydown = (event: KeyboardEvent) => {
    const key = [
      event.ctrlKey && 'ctrl',
      event.metaKey && 'meta',
      event.altKey && 'alt',
      event.shiftKey && 'shift',
      event.key.toLowerCase(),
    ]
      .filter(Boolean)
      .join('+')

    if (shortcuts[key]) {
      event.preventDefault()
      shortcuts[key]()
      logger.debug('Keyboard shortcut triggered', key)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}

/**
 * 网络状态 composable
 */
export function useOnline() {
  const isOnline = ref(navigator.onLine)

  useEventListener(window, 'online', () => {
    isOnline.value = true
    logger.info('Network online')
  })

  useEventListener(window, 'offline', () => {
    isOnline.value = false
    logger.warn('Network offline')
  })

  return { isOnline }
}

/**
 * 剪贴板 composable
 */
export function useClipboardCopy() {
  const copied = ref(false)
  const error = ref<Error | null>(null)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      error.value = null
      logger.debug('Text copied to clipboard')

      // 2秒后重置状态
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
    catch (err) {
      error.value = err as Error
      copied.value = false
      logger.error('Failed to copy to clipboard', err)
    }
  }

  return { copied, error, copy }
}

/**
 * 文件上传 composable
 */
export function useFileUpload(options: {
  accept?: string
  maxSize?: number
  onUpload: (file: File) => Promise<string>
}) {
  const { accept = '*', maxSize = 5 * 1024 * 1024, onUpload } = options

  const isUploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)
  const url = ref<string | null>(null)

  const upload = async (file: File): Promise<string | null> => {
    // 检查文件类型
    if (accept !== '*') {
      const acceptTypes = accept.split(',').map(t => t.trim())
      const isValidType = acceptTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.endsWith(type)
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'))
        }
        return file.type === type
      })

      if (!isValidType) {
        error.value = '不支持的文件类型'
        logger.warn('Invalid file type', { type: file.type, accept })
        return null
      }
    }

    // 检查文件大小
    if (file.size > maxSize) {
      error.value = `文件大小不能超过 ${(maxSize / 1024 / 1024).toFixed(1)}MB`
      logger.warn('File too large', { size: file.size, maxSize })
      return null
    }

    isUploading.value = true
    progress.value = 0
    error.value = null

    try {
      const result = await onUpload(file)
      url.value = result
      progress.value = 100
      logger.info('File uploaded successfully', { url: result })
      return result
    }
    catch (err) {
      const appError = normalizeError(err)
      error.value = appError.message
      logger.error('File upload failed', appError)
      return null
    }
    finally {
      isUploading.value = false
    }
  }

  const reset = () => {
    isUploading.value = false
    progress.value = 0
    error.value = null
    url.value = null
  }

  return {
    isUploading,
    progress,
    error,
    url,
    upload,
    reset,
  }
}

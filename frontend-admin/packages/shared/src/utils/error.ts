/**
 * 统一错误处理模块
 */

// 错误类型枚举
export enum ErrorType {
  // 网络错误
  NETWORK = 'NETWORK',
  // 认证错误
  AUTH = 'AUTH',
  // 权限错误
  PERMISSION = 'PERMISSION',
  // 验证错误
  VALIDATION = 'VALIDATION',
  // 业务错误
  BUSINESS = 'BUSINESS',
  // 服务器错误
  SERVER = 'SERVER',
  // 未知错误
  UNKNOWN = 'UNKNOWN',
}

// 错误码映射
export const ERROR_CODES = {
  // 网络相关
  NETWORK_ERROR: 'E1001',
  TIMEOUT: 'E1002',
  ABORT: 'E1003',

  // 认证相关
  UNAUTHORIZED: 'E2001',
  TOKEN_EXPIRED: 'E2002',
  TOKEN_INVALID: 'E2003',

  // 权限相关
  FORBIDDEN: 'E3001',
  NO_PERMISSION: 'E3002',

  // 验证相关
  VALIDATION_FAILED: 'E4001',
  REQUIRED_FIELD: 'E4002',
  INVALID_FORMAT: 'E4003',
  OUT_OF_RANGE: 'E4004',

  // 业务相关
  NOT_FOUND: 'E5001',
  DUPLICATE: 'E5002',
  CONFLICT: 'E5003',
  OPERATION_FAILED: 'E5004',

  // 服务器相关
  SERVER_ERROR: 'E6001',
  SERVICE_UNAVAILABLE: 'E6002',
  DATABASE_ERROR: 'E6003',

  // 未知错误
  UNKNOWN: 'E9999',
} as const

// 错误消息映射
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.NETWORK_ERROR]: '网络连接失败，请检查网络设置',
  [ERROR_CODES.TIMEOUT]: '请求超时，请稍后重试',
  [ERROR_CODES.ABORT]: '请求已取消',

  [ERROR_CODES.UNAUTHORIZED]: '请先登录',
  [ERROR_CODES.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [ERROR_CODES.TOKEN_INVALID]: '无效的登录凭证',

  [ERROR_CODES.FORBIDDEN]: '没有访问权限',
  [ERROR_CODES.NO_PERMISSION]: '没有操作权限',

  [ERROR_CODES.VALIDATION_FAILED]: '数据验证失败',
  [ERROR_CODES.REQUIRED_FIELD]: '必填字段不能为空',
  [ERROR_CODES.INVALID_FORMAT]: '数据格式不正确',
  [ERROR_CODES.OUT_OF_RANGE]: '数值超出范围',

  [ERROR_CODES.NOT_FOUND]: '请求的资源不存在',
  [ERROR_CODES.DUPLICATE]: '数据已存在',
  [ERROR_CODES.CONFLICT]: '数据冲突',
  [ERROR_CODES.OPERATION_FAILED]: '操作失败',

  [ERROR_CODES.SERVER_ERROR]: '服务器内部错误',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: '服务暂不可用',
  [ERROR_CODES.DATABASE_ERROR]: '数据库错误',

  [ERROR_CODES.UNKNOWN]: '未知错误',
}

// 自定义错误类
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly code: string
  public readonly details?: Record<string, unknown>
  public readonly timestamp: Date
  public readonly originalError?: Error

  constructor(options: {
    type: ErrorType
    code: string
    message?: string
    details?: Record<string, unknown>
    originalError?: Error
  }) {
    const message = options.message || ERROR_MESSAGES[options.code] || '未知错误'
    super(message)

    this.name = 'AppError'
    this.type = options.type
    this.code = options.code
    this.details = options.details
    this.timestamp = new Date()
    this.originalError = options.originalError

    // 保持正确的原型链
    Object.setPrototypeOf(this, AppError.prototype)
  }

  // 序列化为 JSON
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      type: this.type,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    }
  }

  // 是否为特定类型的错误
  isType(type: ErrorType): boolean {
    return this.type === type
  }

  // 是否为认证错误
  isAuthError(): boolean {
    return this.type === ErrorType.AUTH
  }

  // 是否为网络错误
  isNetworkError(): boolean {
    return this.type === ErrorType.NETWORK
  }

  // 是否为验证错误
  isValidationError(): boolean {
    return this.type === ErrorType.VALIDATION
  }
}

// 错误工厂函数
export const createError = {
  network: (message?: string, originalError?: Error) =>
    new AppError({
      type: ErrorType.NETWORK,
      code: ERROR_CODES.NETWORK_ERROR,
      message,
      originalError,
    }),

  timeout: (message?: string) =>
    new AppError({
      type: ErrorType.NETWORK,
      code: ERROR_CODES.TIMEOUT,
      message,
    }),

  unauthorized: (message?: string) =>
    new AppError({
      type: ErrorType.AUTH,
      code: ERROR_CODES.UNAUTHORIZED,
      message,
    }),

  tokenExpired: (message?: string) =>
    new AppError({
      type: ErrorType.AUTH,
      code: ERROR_CODES.TOKEN_EXPIRED,
      message,
    }),

  forbidden: (message?: string) =>
    new AppError({
      type: ErrorType.PERMISSION,
      code: ERROR_CODES.FORBIDDEN,
      message,
    }),

  validation: (details?: Record<string, unknown>, message?: string) =>
    new AppError({
      type: ErrorType.VALIDATION,
      code: ERROR_CODES.VALIDATION_FAILED,
      message,
      details,
    }),

  notFound: (resource?: string) =>
    new AppError({
      type: ErrorType.BUSINESS,
      code: ERROR_CODES.NOT_FOUND,
      message: resource ? `${resource}不存在` : undefined,
    }),

  duplicate: (resource?: string) =>
    new AppError({
      type: ErrorType.BUSINESS,
      code: ERROR_CODES.DUPLICATE,
      message: resource ? `${resource}已存在` : undefined,
    }),

  server: (message?: string, originalError?: Error) =>
    new AppError({
      type: ErrorType.SERVER,
      code: ERROR_CODES.SERVER_ERROR,
      message,
      originalError,
    }),

  unknown: (originalError?: Error) =>
    new AppError({
      type: ErrorType.UNKNOWN,
      code: ERROR_CODES.UNKNOWN,
      originalError,
    }),
}

// 从 HTTP 状态码创建错误
export function createErrorFromStatus(status: number, message?: string): AppError {
  switch (status) {
    case 400:
      return createError.validation(undefined, message || '请求参数错误')
    case 401:
      return createError.unauthorized(message)
    case 403:
      return createError.forbidden(message)
    case 404:
      return createError.notFound(message)
    case 409:
      return createError.duplicate(message)
    case 422:
      return createError.validation(undefined, message)
    case 500:
      return createError.server(message)
    case 502:
    case 503:
    case 504:
      return new AppError({
        type: ErrorType.SERVER,
        code: ERROR_CODES.SERVICE_UNAVAILABLE,
        message: message || '服务暂不可用，请稍后重试',
      })
    default:
      return createError.unknown()
  }
}

// 从原生错误创建 AppError
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    // 检查是否为网络错误
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return createError.network(undefined, error)
    }

    // 检查是否为中止错误
    if (error.name === 'AbortError') {
      return new AppError({
        type: ErrorType.NETWORK,
        code: ERROR_CODES.ABORT,
        originalError: error,
      })
    }

    return createError.unknown(error)
  }

  return createError.unknown()
}

// 错误处理器类型
export type ErrorHandler = (error: AppError) => void

// 全局错误处理器
let globalErrorHandler: ErrorHandler | null = null

// 设置全局错误处理器
export function setGlobalErrorHandler(handler: ErrorHandler): void {
  globalErrorHandler = handler
}

// 处理错误
export function handleError(error: unknown): void {
  const appError = normalizeError(error)

  if (globalErrorHandler) {
    globalErrorHandler(appError)
  }
  else {
    console.error('[AppError]', appError.toJSON())
  }
}

// 安全执行函数
export async function safeExecute<T>(fn: () => Promise<T>, fallback?: T): Promise<T | undefined> {
  try {
    return await fn()
  }
  catch (error) {
    handleError(error)
    return fallback
  }
}

// 重试执行函数
export async function retryExecute<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    delay?: number
    shouldRetry?: (error: AppError, attempt: number) => boolean
  } = {},
): Promise<T> {
  const { maxRetries = 3, delay = 1000, shouldRetry } = options
  let lastError: AppError | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    }
    catch (error) {
      lastError = normalizeError(error)

      // 检查是否应该重试
      if (shouldRetry && !shouldRetry(lastError, attempt)) {
        throw lastError
      }

      // 认证错误不重试
      if (lastError.isAuthError()) {
        throw lastError
      }

      // 最后一次尝试不等待
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }

  throw lastError || createError.unknown()
}

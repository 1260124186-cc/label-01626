/**
 * 数据校验模块
 */

// 校验规则类型
export interface ValidationRule<T = unknown> {
  validator: (value: T, formData?: Record<string, unknown>) => boolean | Promise<boolean>
  message: string | ((value: T) => string)
}

// 字段校验配置
export interface FieldValidation<T = unknown> {
  required?: boolean | string
  rules?: ValidationRule<T>[]
}

// 表单校验配置
export type FormValidation<T extends Record<string, unknown>> = {
  [K in keyof T]?: FieldValidation<T[K]>
}

// 校验错误
export interface ValidationError {
  field: string
  message: string
}

// 校验结果
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

// 内置校验规则
export const rules = {
  // 必填
  required: (message = '此字段为必填项'): ValidationRule => ({
    validator: (value) => {
      if (value === null || value === undefined)
        return false
      if (typeof value === 'string')
        return value.trim().length > 0
      if (Array.isArray(value))
        return value.length > 0
      return true
    },
    message,
  }),

  // 最小长度
  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validator: value => !value || value.length >= min,
    message: message || `长度不能少于 ${min} 个字符`,
  }),

  // 最大长度
  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validator: value => !value || value.length <= max,
    message: message || `长度不能超过 ${max} 个字符`,
  }),

  // 长度范围
  lengthRange: (min: number, max: number, message?: string): ValidationRule<string> => ({
    validator: value => !value || (value.length >= min && value.length <= max),
    message: message || `长度必须在 ${min} 到 ${max} 个字符之间`,
  }),

  // 最小值
  min: (min: number, message?: string): ValidationRule<number> => ({
    validator: value => value === undefined || value === null || value >= min,
    message: message || `值不能小于 ${min}`,
  }),

  // 最大值
  max: (max: number, message?: string): ValidationRule<number> => ({
    validator: value => value === undefined || value === null || value <= max,
    message: message || `值不能大于 ${max}`,
  }),

  // 数值范围
  range: (min: number, max: number, message?: string): ValidationRule<number> => ({
    validator: value => value === undefined || value === null || (value >= min && value <= max),
    message: message || `值必须在 ${min} 到 ${max} 之间`,
  }),

  // 邮箱格式
  email: (message = '请输入有效的邮箱地址'): ValidationRule<string> => ({
    validator: (value) => {
      if (!value)
        return true
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
  }),

  // 手机号格式 (中国)
  phone: (message = '请输入有效的手机号码'): ValidationRule<string> => ({
    validator: (value) => {
      if (!value)
        return true
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(value)
    },
    message,
  }),

  // URL 格式
  url: (message = '请输入有效的 URL'): ValidationRule<string> => ({
    validator: (value) => {
      if (!value)
        return true
      try {
        return Boolean(new URL(value))
      }
      catch {
        return false
      }
    },
    message,
  }),

  // 正则匹配
  pattern: (regex: RegExp, message = '格式不正确'): ValidationRule<string> => ({
    validator: value => !value || regex.test(value),
    message,
  }),

  // 仅字母
  alpha: (message = '只能包含字母'): ValidationRule<string> => ({
    validator: value => !value || /^[a-z]+$/i.test(value),
    message,
  }),

  // 字母和数字
  alphanumeric: (message = '只能包含字母和数字'): ValidationRule<string> => ({
    validator: value => !value || /^[a-z0-9]+$/i.test(value),
    message,
  }),

  // 数字
  numeric: (message = '只能包含数字'): ValidationRule<string> => ({
    validator: value => !value || /^\d+$/.test(value),
    message,
  }),

  // 整数
  integer: (message = '请输入整数'): ValidationRule<number | string> => ({
    validator: (value) => {
      if (value === undefined || value === null || value === '')
        return true
      return Number.isInteger(Number(value))
    },
    message,
  }),

  // 密码强度
  password: (options?: {
    minLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumber?: boolean
    requireSpecial?: boolean
  }): ValidationRule<string> => {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumber = true,
      requireSpecial = false,
    } = options || {}

    return {
      validator: (value) => {
        if (!value)
          return true
        if (value.length < minLength)
          return false
        if (requireUppercase && !/[A-Z]/.test(value))
          return false
        if (requireLowercase && !/[a-z]/.test(value))
          return false
        if (requireNumber && !/\d/.test(value))
          return false
        if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value))
          return false
        return true
      },
      message: (value) => {
        if (!value)
          return ''
        const errors: string[] = []
        if (value.length < minLength)
          errors.push(`至少 ${minLength} 个字符`)
        if (requireUppercase && !/[A-Z]/.test(value))
          errors.push('包含大写字母')
        if (requireLowercase && !/[a-z]/.test(value))
          errors.push('包含小写字母')
        if (requireNumber && !/\d/.test(value))
          errors.push('包含数字')
        if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value))
          errors.push('包含特殊字符')
        return `密码需要: ${errors.join(', ')}`
      },
    }
  },

  // 确认密码
  confirmPassword: (
    passwordField: string,
    message = '两次输入的密码不一致',
  ): ValidationRule<string> => ({
    validator: (value, formData) => {
      if (!value || !formData)
        return true
      return value === formData[passwordField]
    },
    message,
  }),

  // 日期格式
  date: (message = '请输入有效的日期'): ValidationRule<string> => ({
    validator: (value) => {
      if (!value)
        return true
      const date = new Date(value)
      return !Number.isNaN(date.getTime())
    },
    message,
  }),

  // 日期范围
  dateRange: (
    minDate?: Date | string,
    maxDate?: Date | string,
    message?: string,
  ): ValidationRule<string> => ({
    validator: (value) => {
      if (!value)
        return true
      const date = new Date(value)
      if (Number.isNaN(date.getTime()))
        return false
      if (minDate && date < new Date(minDate))
        return false
      if (maxDate && date > new Date(maxDate))
        return false
      return true
    },
    message: message || '日期超出有效范围',
  }),

  // 自定义校验
  custom: <T>(
    validator: (value: T, formData?: Record<string, unknown>) => boolean | Promise<boolean>,
    message: string,
  ): ValidationRule<T> => ({
    validator,
    message,
  }),
}

// 校验单个字段
export async function validateField<T>(
  value: T,
  validation: FieldValidation<T>,
  formData?: Record<string, unknown>,
): Promise<string | null> {
  // 检查必填
  if (validation.required) {
    const isEmpty
      = value === null
        || value === undefined
        || (typeof value === 'string' && value.trim() === '')
        || (Array.isArray(value) && value.length === 0)

    if (isEmpty) {
      return typeof validation.required === 'string' ? validation.required : '此字段为必填项'
    }
  }

  // 执行规则校验
  if (validation.rules) {
    for (const rule of validation.rules) {
      const isValid = await rule.validator(value, formData)
      if (!isValid) {
        return typeof rule.message === 'function' ? rule.message(value) : rule.message
      }
    }
  }

  return null
}

// 校验整个表单
export async function validateForm<T extends Record<string, unknown>>(
  formData: T,
  validation: FormValidation<T>,
): Promise<ValidationResult> {
  const errors: ValidationError[] = []

  for (const field in validation) {
    const fieldValidation = validation[field]
    if (!fieldValidation)
      continue

    const value = formData[field]
    const error = await validateField(value, fieldValidation, formData)

    if (error) {
      errors.push({ field, message: error })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// 创建表单校验器
export function createFormValidator<T extends Record<string, unknown>>(
  validation: FormValidation<T>,
) {
  return {
    validate: (formData: T) => validateForm(formData, validation),
    validateField: <K extends keyof T>(field: K, value: T[K], formData?: T) =>
      validateField(value, validation[field] || {}, formData as Record<string, unknown>),
  }
}

// 常用表单校验配置
export const commonValidations = {
  // 用户名
  username: {
    required: '请输入用户名',
    rules: [
      rules.lengthRange(3, 20, '用户名长度需在 3-20 个字符之间'),
      rules.pattern(/^\w+$/, '用户名只能包含字母、数字和下划线'),
    ],
  },

  // 邮箱
  email: {
    required: '请输入邮箱',
    rules: [rules.email()],
  },

  // 密码
  password: {
    required: '请输入密码',
    rules: [rules.password()],
  },

  // 手机号
  phone: {
    rules: [rules.phone()],
  },

  // 标题
  title: {
    required: '请输入标题',
    rules: [rules.lengthRange(1, 100, '标题长度需在 1-100 个字符之间')],
  },

  // 内容
  content: {
    required: '请输入内容',
    rules: [rules.minLength(10, '内容至少需要 10 个字符')],
  },
}

/**
 * 日志系统模块
 */

// 日志级别
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

// 日志级别名称
const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.SILENT]: 'SILENT',
}

// 日志级别颜色 (控制台)
const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '#9CA3AF',
  [LogLevel.INFO]: '#3B82F6',
  [LogLevel.WARN]: '#F59E0B',
  [LogLevel.ERROR]: '#EF4444',
  [LogLevel.SILENT]: '#000000',
}

// 日志条目接口
export interface LogEntry {
  level: LogLevel
  levelName: string
  message: string
  timestamp: Date
  context?: string
  data?: unknown
  stack?: string
}

// 日志传输器接口
export interface LogTransport {
  log: (entry: LogEntry) => void
}

// 控制台传输器
export class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const color = LOG_LEVEL_COLORS[entry.level]
    const timestamp = entry.timestamp.toISOString()
    const prefix = entry.context ? `[${entry.context}]` : ''

    const style = `color: ${color}; font-weight: bold;`
    const args: unknown[] = [
      `%c${entry.levelName}%c ${timestamp} ${prefix} ${entry.message}`,
      style,
      'color: inherit;',
    ]

    if (entry.data !== undefined) {
      args.push('\n', entry.data)
    }

    if (entry.stack) {
      args.push('\n', entry.stack)
    }

    switch (entry.level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(...args)
        break
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(...args)
        break
      case LogLevel.WARN:
        console.warn(...args)
        break
      case LogLevel.ERROR:
        console.error(...args)
        break
    }
  }
}

// 内存传输器 (用于收集日志)
export class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = []
  private maxSize: number

  constructor(maxSize = 1000) {
    this.maxSize = maxSize
  }

  log(entry: LogEntry): void {
    this.logs.push(entry)
    if (this.logs.length > this.maxSize) {
      this.logs.shift()
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  clear(): void {
    this.logs = []
  }

  export(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// 远程传输器 (发送到服务器)
export class RemoteTransport implements LogTransport {
  private endpoint: string
  private batchSize: number
  private flushInterval: number
  private buffer: LogEntry[] = []
  private timer: ReturnType<typeof setInterval> | null = null

  constructor(options: { endpoint: string, batchSize?: number, flushInterval?: number }) {
    this.endpoint = options.endpoint
    this.batchSize = options.batchSize || 10
    this.flushInterval = options.flushInterval || 5000

    this.startFlushTimer()
  }

  log(entry: LogEntry): void {
    this.buffer.push(entry)
    if (this.buffer.length >= this.batchSize) {
      this.flush()
    }
  }

  private startFlushTimer(): void {
    if (typeof window !== 'undefined') {
      this.timer = setInterval(() => this.flush(), this.flushInterval)
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0)
      return

    const logs = [...this.buffer]
    this.buffer = []

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      })
    }
    catch {
      // 发送失败，将日志放回缓冲区
      this.buffer.unshift(...logs)
    }
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.flush()
  }
}

// Logger 配置
export interface LoggerConfig {
  level: LogLevel
  context?: string
  transports: LogTransport[]
}

// Logger 类
export class Logger {
  private level: LogLevel
  private context?: string
  private transports: LogTransport[]

  constructor(config: Partial<LoggerConfig> = {}) {
    this.level = config.level ?? LogLevel.INFO
    this.context = config.context
    this.transports = config.transports || [new ConsoleTransport()]
  }

  // 设置日志级别
  setLevel(level: LogLevel): void {
    this.level = level
  }

  // 添加传输器
  addTransport(transport: LogTransport): void {
    this.transports.push(transport)
  }

  // 创建子 Logger
  child(context: string): Logger {
    return new Logger({
      level: this.level,
      context: this.context ? `${this.context}:${context}` : context,
      transports: this.transports,
    })
  }

  // 核心日志方法
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (level < this.level)
      return

    const entry: LogEntry = {
      level,
      levelName: LOG_LEVEL_NAMES[level],
      message,
      timestamp: new Date(),
      context: this.context,
      data,
    }

    // 如果是错误，添加堆栈信息
    if (data instanceof Error) {
      entry.stack = data.stack
    }

    this.transports.forEach(transport => transport.log(entry))
  }

  // 日志方法
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data)
  }

  // 计时器
  time(label: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.debug(`${label}: ${duration.toFixed(2)}ms`)
    }
  }

  // 分组日志
  group(label: string, fn: () => void): void {
    // eslint-disable-next-line no-console
    console.group(label)
    try {
      fn()
    }
    finally {
      // eslint-disable-next-line no-console
      console.groupEnd()
    }
  }

  // 表格日志
  table(data: unknown): void {
    // eslint-disable-next-line no-console
    console.table(data)
  }
}

// 检测是否为生产环境
function isProduction(): boolean {
  if (typeof window !== 'undefined') {
    return window.location.hostname !== 'localhost'
  }
  return false
}

// 默认 Logger 实例
const defaultLogger = new Logger({
  level: isProduction() ? LogLevel.WARN : LogLevel.DEBUG,
})

// 导出默认实例的方法
export const debug = defaultLogger.debug.bind(defaultLogger)
export const info = defaultLogger.info.bind(defaultLogger)
export const warn = defaultLogger.warn.bind(defaultLogger)
export const error = defaultLogger.error.bind(defaultLogger)

// 创建 Logger 工厂
export function createLogger(context: string): Logger {
  return defaultLogger.child(context)
}

// 导出默认 Logger
export default defaultLogger

// ============================================================================
// 基础工具类型
// ============================================================================

/** 唯一标识符类型 */
export type ID = string

/** 时间戳字符串（ISO 8601 格式） */
export type ISODateString = string

/** 可空类型 */
export type Nullable<T> = T | null

/** 可能为 undefined 的类型 */
export type Maybe<T> = T | undefined

/** 使对象所有属性变为可选（深层） */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** 使对象所有属性变为只读（深层） */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/** 从类型中排除 null 和 undefined */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

/** 提取对象中指定类型的键 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

/** 排除对象中的特定键 */
export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/** 必填指定键 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/** 异步函数返回类型 */
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> = T extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R
  : never

// ============================================================================
// 博客文章相关类型
// ============================================================================

/** 博客文章类型 */
export interface Post {
  readonly id: ID
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  author: Author
  category: Category
  tags: Tag[]
  status: PostStatus
  publishedAt?: ISODateString
  readonly createdAt: ISODateString
  updatedAt: ISODateString
  viewCount: number
  likeCount: number
}

/** 文章状态 */
export type PostStatus = 'draft' | 'published' | 'archived'

/** 文章状态标签映射 */
export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
} as const

/** 创建文章请求 */
export interface CreatePostRequest {
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  categoryId: ID
  tagIds: ID[]
  status?: PostStatus
}

/** 更新文章请求 */
export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: ID
}

/** 文章筛选条件 */
export interface PostFilters {
  status?: PostStatus
  categoryId?: ID
  tagIds?: ID[]
  authorId?: ID
  search?: string
  startDate?: ISODateString
  endDate?: ISODateString
}

/** 创建文章的输入类型（排除自动生成的字段） */
export type CreatePostInput = Omit<
  Post,
  'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount'
>

/** 更新文章的输入类型（所有字段可选，除了 id） */
export type UpdatePostInput = Partial<Omit<Post, 'id'>> & { id: string }

/** 文章列表项（简化版，用于列表展示） */
export type PostListItem = Pick<
  Post,
  'id' | 'title' | 'slug' | 'excerpt' | 'coverImage' | 'status' | 'publishedAt' | 'viewCount'
>

/** 文章搜索参数 */
export interface PostSearchParams extends PaginationParams {
  keyword?: string
  status?: PostStatus
  categoryId?: string
  tagIds?: string[]
  startDate?: string
  endDate?: string
}

// ============================================================================
// 用户相关类型
// ============================================================================

/** 作者类型 */
export interface Author {
  readonly id: ID
  name: string
  email: string
  avatar?: string
  bio?: string
  role: UserRole
}

/** 用户角色 */
export type UserRole = 'admin' | 'editor' | 'author' | 'reader'

/** 用户角色标签映射 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: '管理员',
  editor: '编辑',
  author: '作者',
  reader: '读者',
} as const

/** 用户类型 */
export interface User {
  readonly id: ID
  username: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  readonly createdAt: ISODateString
  lastLoginAt?: ISODateString
}

/** 登录请求 */
export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

/** 登录响应 */
export interface LoginResponse {
  token: string
  user: User
  expiresAt: ISODateString
}

/** 用户会话信息 */
export interface UserSession {
  user: User
  token: string
  expiresAt: ISODateString
  isAuthenticated: boolean
}

// ============================================================================
// 分类和标签类型
// ============================================================================

/** 分类类型 */
export interface Category {
  readonly id: ID
  name: string
  slug: string
  description?: string
  parentId?: ID
  postCount: number
}

/** 标签类型 */
export interface Tag {
  readonly id: ID
  name: string
  slug: string
  postCount: number
}

/** 创建分类请求 */
export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string
  parentId?: ID
}

/** 创建标签请求 */
export interface CreateTagRequest {
  name: string
  slug: string
}

// ============================================================================
// 评论类型
// ============================================================================

/** 评论作者（访客） */
export interface CommentAuthor {
  name: string
  email: string
  avatar?: string
}

/** 评论类型 */
export interface Comment {
  readonly id: ID
  postId: ID
  content: string
  author: CommentAuthor
  parentId?: ID
  status: CommentStatus
  readonly createdAt: ISODateString
}

/** 评论状态 */
export type CommentStatus = 'pending' | 'approved' | 'spam' | 'trash'

/** 评论状态标签映射 */
export const COMMENT_STATUS_LABELS: Record<CommentStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  spam: '垃圾评论',
  trash: '已删除',
} as const

// ============================================================================
// API 相关类型
// ============================================================================

/** API 响应包装 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

/** API 错误响应 */
export interface ApiErrorResponse {
  success: false
  error: string
  code: number
  details?: Record<string, string[]>
}

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/** 列表查询参数 */
export interface ListQueryParams<TFilters = Record<string, unknown>> extends PaginationParams {
  filters?: TFilters
  search?: string
}

/** 排序方向 */
export type SortDirection = 'asc' | 'desc'

/** 排序选项 */
export interface SortOption<T extends string = string> {
  field: T
  direction: SortDirection
}

// ============================================================================
// 站点配置类型
// ============================================================================

/** 社交媒体链接 */
export interface SocialLinks {
  github?: string
  twitter?: string
  weibo?: string
  email?: string
  linkedin?: string
  youtube?: string
}

/** 站点配置 */
export interface SiteConfig {
  title: string
  description: string
  logo?: string
  favicon?: string
  keywords: string[]
  author: string
  social: SocialLinks
  language: string
  timezone: string
}

// ============================================================================
// UI 组件类型
// ============================================================================

/** 导航菜单项 */
export interface MenuItem {
  readonly id: ID
  label: string
  path: string
  icon?: string
  children?: MenuItem[]
  external?: boolean
  badge?: string | number
  disabled?: boolean
}

/** Toast 通知类型 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/** Toast 选项 */
export interface ToastOptions {
  type: ToastType
  title: string
  message?: string
  duration?: number
  closable?: boolean
}

/** 模态框选项 */
export interface ModalOptions {
  title: string
  content?: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'error' | 'confirm'
  closable?: boolean
}

/** 表格列定义 */
export interface TableColumn<T = unknown> {
  key: keyof T | string
  title: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  render?: (value: unknown, row: T, index: number) => unknown
}

/** 表单字段定义 */
export interface FormField<T = unknown> {
  name: keyof T
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'password'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: Array<{ label: string, value: string | number }>
  rules?: FormRule[]
}

/** 表单验证规则 */
export interface FormRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  message: string
  value?: number | string | RegExp
  validator?: (value: unknown) => boolean | Promise<boolean>
}

/** 表单字段验证状态 */
export type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid'

/** 表单字段状态 */
export interface FieldState<T = unknown> {
  value: T
  error: string | null
  touched: boolean
  dirty: boolean
  status: ValidationStatus
}

/** 表单状态 */
export interface FormState {
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  errors: Record<string, string | null>
}

/** 按钮尺寸 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** 按钮变体 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft' | 'link'

/** 颜色主题 */
export type ColorTheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

/** 输入框尺寸 */
export type InputSize = 'sm' | 'md' | 'lg'

/** 通用组件状态 */
export interface ComponentState {
  loading?: boolean
  disabled?: boolean
  error?: string | null
}

// ============================================================================
// 统计相关类型
// ============================================================================

/** 仪表盘统计数据 */
export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalComments: number
  totalUsers: number
}

/** 趋势数据点 */
export interface TrendDataPoint {
  date: ISODateString
  value: number
  label?: string
}

/** 图表数据 */
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }>
}

// ============================================================================
// 事件类型
// ============================================================================

/** 通用事件载荷 */
export interface EventPayload<T = unknown> {
  type: string
  data: T
  timestamp: ISODateString
}

/** 文章事件类型 */
export type PostEventType = 'created' | 'updated' | 'deleted' | 'published' | 'unpublished'

/** 文章事件载荷 */
export interface PostEventPayload extends EventPayload<Post> {
  type: PostEventType
}

/** 通用事件处理器类型 */
export type EventHandler<T = void> = (payload: T) => void

/** 异步事件处理器类型 */
export type AsyncEventHandler<T = void, R = void> = (payload: T) => Promise<R>

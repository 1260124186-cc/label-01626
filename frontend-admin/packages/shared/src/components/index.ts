// 共享组件导出
// 注意：博客主站使用 Nuxt UI，管理后台使用这里的 UI 组件

// UI 组件 (用于管理后台)
export * from './ui'

// 组件 Props 接口定义 (用于类型检查)
export interface BaseButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
}

export interface BaseCardProps {
  title?: string
  description?: string
  hoverable?: boolean
  bordered?: boolean
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

export interface BaseInputProps {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: string
  hint?: string
  icon?: string
}

export interface BaseModalProps {
  modelValue?: boolean
  title?: string
  description?: string
  closable?: boolean
  closeOnOverlay?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface BasePaginationProps {
  page: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: number[]
}

export interface BaseTableColumn<T = unknown> {
  key: string
  label: string
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => string
}

export interface BaseTableProps<T = unknown> {
  columns: BaseTableColumn<T>[]
  data: T[]
  loading?: boolean
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  emptyText?: string
}

// 文章卡片 Props
export interface PostCardProps {
  title: string
  excerpt: string
  coverImage?: string
  author: {
    name: string
    avatar?: string
  }
  category: string
  tags?: string[]
  publishedAt: string
  viewCount?: number
  likeCount?: number
  href: string
}

// 评论项 Props
export interface CommentItemProps {
  id: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  replies?: CommentItemProps[]
  onReply?: (id: string) => void
}

// 标签云 Props
export interface TagCloudProps {
  tags: Array<{
    name: string
    slug: string
    count: number
  }>
  maxSize?: number
  minSize?: number
}

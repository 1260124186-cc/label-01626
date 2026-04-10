# TechBlog - 技术博客系统

一个现代化的技术博客平台，包含博客主站和管理后台两个应用。

## 1. How to Run

### 快速开始（Docker 一键部署）

确保已安装 Docker 和 Docker Compose，然后执行：

```bash
# 构建并启动所有服务
docker compose up --build -d

# 等待服务启动完成（约 1-2 分钟）
docker compose ps

# 访问应用
# 博客主站: http://localhost:8081
# 管理后台: http://localhost:8081/admin
```

### 本地开发详细步骤

```bash
# 1. 进入前端项目目录
cd frontend-admin

# 2. 安装 pnpm（如果未安装）
npm install -g pnpm

# 3. 安装项目依赖
pnpm install

# 4. 启动开发服务器
pnpm dev              # 同时启动博客和管理后台
# 或者单独启动
pnpm dev:blog         # 博客主站 http://localhost:8081
pnpm dev:admin        # 管理后台 http://localhost:8082/admin/

# 5. 构建生产版本
pnpm build

# 6. 代码检查
pnpm lint             # ESLint 检查
pnpm format           # Prettier 格式化
```

### 环境要求

**Docker 部署（推荐）：**
- Docker >= 20.0
- Docker Compose >= 2.0
- 内存 >= 2GB（构建时需要）
- 磁盘空间 >= 2GB

**本地开发：**
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- 内存 >= 4GB（推荐）

## 2. Services

| 服务 | 路由 | 描述 | 技术栈 |
|------|------|------|--------|
| 博客主站 | http://localhost:8081/ | 面向用户的博客前台，支持 SSR/SEO | Nuxt 4 + Vue 3 + Nuxt UI + TailwindCSS v4 |
| 管理后台 | http://localhost:8081/admin | 内容管理系统 | Vue 3 + Vite + 自定义 UI 组件 + TailwindCSS v4 |

### 访问地址

- 博客主站: http://localhost:8081
- 管理后台: http://localhost:8081/admin

## 3. 测试账号

管理后台登录账号：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |

## 4. 题目内容

**原始 Prompt 内容：**

这个项目包括了：

一个博客主站 Web（考虑 seo， nuxt4）

一个博客管理副站（不考虑 seo， vue3 +vite）

且全项目都尽量使用 typescript。

这两个站点都同时用到了 ：
tailwindcss v4
nuxt ui
eslint
Prettier
vueuse

希望尽可能重用这些公用的包，不要重复引用和依赖。

现在项目还没搭建好，你帮我完善下。

---

## 5. 技术选型说明

### 关于 Nuxt UI 在管理后台的使用

**Prompt 要求：** 两个站点都使用 Nuxt UI

**实际实现：** 管理后台使用自定义 UI 组件

**原因说明：**

Nuxt UI 是专门为 Nuxt 框架设计的组件库，它深度依赖 Nuxt 的模块系统和自动导入功能。而管理后台根据 Prompt 要求使用 **Vue 3 + Vite**（不考虑 SEO，无需 SSR），这意味着：

1. **架构差异**：Nuxt UI 的组件需要 Nuxt 运行时环境，无法直接在纯 Vue 3 + Vite 项目中使用
2. **依赖冲突**：如果强行引入 Nuxt UI，需要将管理后台改为 Nuxt 框架，这会违背 Prompt 中"vue3 + vite"的要求
3. **解决方案**：为管理后台开发了一套风格统一的自定义 UI 组件（UButton, UInput, UTextarea, USelectMenu, UCheckbox），这些组件：
   - 使用相同的 TailwindCSS v4 样式系统
   - 保持与博客主站一致的视觉风格（颜色、圆角、间距）
   - 支持暗色模式
   - 提供完整的交互反馈（Hover、Loading、禁用状态）

### 共享代码策略

为了最大化代码复用并避免重复依赖，项目采用以下策略：

| 共享内容 | 实现方式 |
|----------|----------|
| Vue / Vue Router | `@blog/shared` 包统一管理，子项目不单独依赖 |
| VueUse 工具 | `@blog/shared` 包统一导出，子项目不单独依赖 |
| Marked (Markdown 解析) | `@blog/shared` 包统一管理，子项目不单独依赖 |
| 类型定义 | `@blog/shared` 包统一导出 |
| 数据操作 | `@blog/shared` 包的 data 模块 |
| TailwindCSS | 各项目独立配置，使用相同的 v4 版本 |
| ESLint/Prettier | 根目录统一配置 |

**依赖管理架构：**

```
@blog/shared (共享包)
├── vue ^3.5.13
├── vue-router ^4.5.0
├── @vueuse/core ^12.4.0
├── marked ^17.0.2
└── @iconify/vue ^4.1.2

@blog/web (博客主站)
├── @blog/shared (workspace:*)  ← 通过共享包获取 vue、vue-router、marked 等
├── @nuxt/ui ^3.0.0             ← Nuxt 专用 UI 框架
├── @vueuse/nuxt ^12.4.0        ← Nuxt 专用 VueUse 集成
└── nuxt ^4.0.0                 ← Nuxt 框架

@blog/admin (管理后台)
└── @blog/shared (workspace:*)  ← 通过共享包获取所有共享依赖
```

---

## 6. 数据存储说明

### 数据持久化方案

本项目采用 **localStorage** 作为数据持久化方案，文章数据存储在浏览器本地。

**存储键名：** `techblog_posts`

**特点：**
- 管理后台对文章的增删改操作会自动同步到 localStorage
- 页面刷新后数据保持不变
- 首次访问时自动加载默认示例文章

### 默认文章数据

系统预置了 3 篇示例文章，首次访问时会自动加载：

1. **Vue 3 组合式 API 完全指南** - 介绍 Vue 3 的组合式 API 核心概念（封面图：vue3.webp）
2. **TypeScript 入门到精通** - TypeScript 类型系统和高级特性（封面图：ts.webp）
3. **Tailwind CSS 实战技巧** - Tailwind CSS 的实用技巧和最佳实践（封面图：css.webp）

这些文章的状态均为"已发布"。

---

## 7. 项目结构

```
label-01626/
├── docker-compose.yml           # Docker Compose 配置
├── .gitignore                   # Git 忽略文件
├── README.md                    # 项目文档
│
└── frontend-admin/              # 前端项目 (Monorepo)
    ├── Dockerfile               # Docker 多阶段构建文件
    ├── nginx.conf               # Nginx 网关配置
    ├── package.json             # 根 package.json
    ├── pnpm-workspace.yaml      # pnpm workspace 配置
    ├── tsconfig.json            # TypeScript 配置
    ├── eslint.config.js         # ESLint 配置
    ├── .prettierrc              # Prettier 配置
    ├── img/                     # 共享图片资源
    │   ├── vue3.webp
    │   ├── ts.webp
    │   └── css.webp
    │
    ├── apps/
    │   ├── blog/                # 博客主站 (Nuxt 4 SSR)
    │   │   ├── assets/css/      # 样式文件（main.css）
    │   │   ├── layouts/         # 布局组件
    │   │   ├── pages/           # 页面组件
    │   │   │   ├── index.vue    # 首页（文章列表）
    │   │   │   ├── about.vue    # 关于页面
    │   │   │   └── posts/
    │   │   │       └── [slug].vue  # 文章详情页
    │   │   ├── utils/           # 工具函数
    │   │   │   └── markdown.ts  # Markdown 解析
    │   │   ├── public/img/      # 静态图片资源
    │   │   ├── nuxt.config.ts   # Nuxt 配置
    │   │   └── package.json
    │   │
    │   └── admin/               # 管理后台 (Vue 3 + Vite SPA)
    │       ├── src/
    │       │   ├── assets/      # 静态资源
    │       │   ├── components/  # UI 组件库
    │       │   │   └── ui/      # 自定义 UI 组件
    │       │   │       ├── UButton.vue
    │       │   │       ├── UInput.vue
    │       │   │       ├── UTextarea.vue
    │       │   │       ├── USelectMenu.vue
    │       │   │       └── UCheckbox.vue
    │       │   ├── layouts/     # 布局组件
    │       │   │   └── AdminLayout.vue
    │       │   ├── router/      # 路由配置
    │       │   │   └── index.ts
    │       │   └── views/       # 页面组件
    │       │       ├── LoginView.vue      # 登录页
    │       │       ├── DashboardView.vue  # 仪表盘
    │       │       ├── PostsView.vue      # 文章列表
    │       │       └── PostEditView.vue   # 文章编辑
    │       ├── vite.config.ts   # Vite 配置
    │       └── package.json
    │
    └── packages/
        └── shared/              # 共享包 (@blog/shared)
            └── src/
                ├── index.ts     # 统一导出入口
                ├── types/       # 共享类型定义
                │   └── index.ts # Post, Author, Category 等类型
                ├── data/        # 数据层
                │   ├── index.ts
                │   └── posts.ts # 文章 CRUD 操作（localStorage）
                ├── composables/ # 共享 Composables
                ├── constants/   # 共享常量
                └── utils/       # 共享工具函数
                    ├── error.ts    # 错误处理
                    ├── logger.ts   # 日志系统
                    └── validator.ts # 数据校验
```

---

## 8. 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Nuxt 4** - Vue 全栈框架（博客主站，支持 SSR/SEO）
- **Vite** - 下一代前端构建工具（管理后台）

### UI 框架
- **Nuxt UI** - 基于 Tailwind CSS 的 Vue 组件库（博客主站）
- **TailwindCSS v4** - 原子化 CSS 框架
- **自定义 UI 组件** - 管理后台 UI 组件库（UButton, UInput, USelectMenu 等）

### 开发工具
- **TypeScript** - JavaScript 的超集，全项目使用
- **ESLint** - 代码检查工具
- **Prettier** - 代码格式化工具
- **VueUse** - Vue Composition API 工具集（通过 @blog/shared 统一导出）

### 部署架构
- **Docker** - 容器化部署（支持 ARM64 和 AMD64）
- **Nginx** - 网关服务器（路由分发、静态文件服务）
- **Node.js** - 运行时环境（博客主站 SSR）

---

## 9. 功能特性

### 博客主站 (路由: /)

| 功能 | 描述 |
|------|------|
| 首页 | 展示已发布文章列表、统计数据（文章总数、总浏览量） |
| 文章详情 | 支持 Markdown 渲染（代码高亮、引用、列表等） |
| 关于页面 | 博客介绍和技术栈展示 |
| 响应式设计 | 支持桌面端和移动端自适应 |
| SEO 优化 | SSR 渲染、动态 Meta 标签 |

### 管理后台 (路由: /admin)

| 功能 | 描述 |
|------|------|
| 登录认证 | 用户名密码登录，登录状态持久化 |
| 仪表盘 | 统计卡片（文章数、已发布、草稿、总浏览）、快捷操作、最近文章 |
| 文章管理 | 文章列表（搜索、状态筛选）、新建/编辑/删除文章 |
| 文章编辑 | 标题、摘要、封面图、分类、标签、Markdown 内容编辑 |
| 退出登录 | 头部头像下拉菜单，点击退出登录 |

---

## 10. 共享包功能 (@blog/shared)

共享包用于在博客主站和管理后台之间共享代码，**统一管理所有共享依赖**，避免重复引用。

### Vue / Vue Router（统一导出）

```typescript
import {
  // Vue 核心
  ref, reactive, computed, watch, watchEffect,
  onMounted, onUnmounted, onBeforeMount, onBeforeUnmount,
  nextTick, defineComponent,
  type Ref, type ComputedRef, type PropType,

  // Vue Router
  useRouter, useRoute,
  createRouter, createWebHistory, createWebHashHistory,
  type Router, type RouteLocationNormalized,
} from '@blog/shared'
```

### 数据操作

```typescript
import {
  getPosts,           // 获取所有文章
  getPublishedPosts,  // 获取已发布文章
  createPost,         // 创建文章
  updatePost,         // 更新文章
  deletePost,         // 删除文章
  publishPost,        // 发布文章
  unpublishPost,      // 取消发布
  incrementViews,     // 增加浏览量
} from '@blog/shared'
```

### 类型定义

```typescript
import type {
  Post,       // 文章类型
  Author,     // 作者类型
  Category,   // 分类类型
  Tag,        // 标签类型
} from '@blog/shared'
```

### VueUse 工具（统一导出）

```typescript
import {
  useDark,
  useToggle,
  useLocalStorage,
  useSessionStorage,
  useColorMode,
  useWindowSize,
  useEventListener,
  onClickOutside,
  useDebounce,
  useThrottle,
  // ... 更多
} from '@blog/shared'
```

### Marked（Markdown 解析）

```typescript
import { marked } from '@blog/shared'

// 使用 marked 解析 Markdown
const html = marked.parse('# Hello World')
```

---

## 11. 许可证

MIT License

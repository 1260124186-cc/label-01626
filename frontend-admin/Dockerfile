# 前端项目 Dockerfile
# 支持多平台构建: linux/amd64, linux/arm64
# 博客主站 (Nuxt SSR) + 管理后台 (Vite SPA)

# ==================== 构建阶段 ====================
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# 复制所有必要的配置文件
COPY package.json pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/blog/package.json ./apps/blog/
COPY apps/admin/package.json ./apps/admin/

# 安装所有依赖
RUN pnpm install --no-frozen-lockfile --shamefully-hoist

# 复制源代码
COPY packages/shared ./packages/shared
COPY apps/blog ./apps/blog
COPY apps/admin ./apps/admin

# 构建博客主站 (Nuxt)
WORKDIR /app/apps/blog
RUN node ../../node_modules/nuxt/bin/nuxt.mjs build

# 构建管理后台 (Vite)
WORKDIR /app/apps/admin
RUN pnpm build

# ==================== 博客 SSR 运行阶段 ====================
FROM node:20-alpine AS blog

WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# 复制博客构建产物
COPY --from=builder --chown=nuxtjs:nodejs /app/apps/blog/.output ./

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

USER nuxtjs

EXPOSE 3000

CMD ["node", "server/index.mjs"]

# ==================== Nginx 网关运行阶段 ====================
FROM nginx:alpine AS gateway

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制管理后台静态文件到 /admin 路径
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html/admin

EXPOSE 8081

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8081/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

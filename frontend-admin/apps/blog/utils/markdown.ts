/**
 * Markdown 解析工具
 * 使用 marked 库将 Markdown 转换为 HTML
 */

import { marked } from '@blog/shared'

// 配置 marked 选项
marked.setOptions({
  // 启用 GitHub 风格的 Markdown
  gfm: true,
  // 启用换行符转换为 <br>
  breaks: true,
})

/**
 * 将 Markdown 文本转换为 HTML
 * @param markdown Markdown 文本
 * @returns HTML 字符串
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown)
    return ''
  return marked.parse(markdown) as string
}

/**
 * 将 Markdown 文本转换为纯文本（移除所有标记）
 * @param markdown Markdown 文本
 * @returns 纯文本字符串
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown)
    return ''
  // 简单的 Markdown 标记移除
  return markdown
    .replace(/#{1,6}\s+/g, '') // 移除标题标记
    .replace(/\*\*(.+?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.+?)\*/g, '$1') // 移除斜体
    .replace(/`(.+?)`/g, '$1') // 移除行内代码
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[.*?\]\(.+?\)/g, '') // 移除图片
    .replace(/>\s+/g, '') // 移除引用
    .replace(/-\s+/g, '') // 移除列表标记
    .replace(/\n+/g, ' ') // 将换行转为空格
    .trim()
}

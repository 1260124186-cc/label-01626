// TailwindCSS 共享配置
// 定义项目中共享的设计系统变量

/**
 * 颜色系统
 * 使用 Tailwind 默认颜色，确保一致性
 */
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  // 使用 slate 作为中性色
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
}

/**
 * 字体系统
 */
export const fontSizes = {
  h1: '2.5rem', // 40px
  h2: '2rem', // 32px
  h3: '1.5rem', // 24px
  h4: '1.25rem', // 20px
  body: '1rem', // 16px
  small: '0.875rem', // 14px
  xs: '0.75rem', // 12px
}

/**
 * 间距系统 (基于 8px 网格)
 */
export const spacing = {
  'xs': '0.25rem', // 4px
  'sm': '0.5rem', // 8px
  'md': '1rem', // 16px
  'lg': '1.5rem', // 24px
  'xl': '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
}

/**
 * 圆角系统
 */
export const borderRadius = {
  'sm': '0.375rem', // 6px
  'md': '0.5rem', // 8px
  'lg': '0.75rem', // 12px
  'xl': '1rem', // 16px
  '2xl': '1.5rem', // 24px
  'full': '9999px',
}

/**
 * 阴影系统
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
}

/**
 * 过渡动画
 */
export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
}

/**
 * 断点
 */
export const breakpoints = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}

/**
 * CSS 变量导出 (用于 CSS 文件)
 */
export const cssVariables = `
:root {
  /* 字体层级系统 */
  --font-h1: ${fontSizes.h1};
  --font-h2: ${fontSizes.h2};
  --font-h3: ${fontSizes.h3};
  --font-h4: ${fontSizes.h4};
  --font-body: ${fontSizes.body};
  --font-small: ${fontSizes.small};
  --font-xs: ${fontSizes.xs};

  /* 间距系统 */
  --spacing-xs: ${spacing.xs};
  --spacing-sm: ${spacing.sm};
  --spacing-md: ${spacing.md};
  --spacing-lg: ${spacing.lg};
  --spacing-xl: ${spacing.xl};
  --spacing-2xl: ${spacing['2xl']};
  --spacing-3xl: ${spacing['3xl']};

  /* 组件间距 */
  --spacing-section: ${spacing['2xl']};
  --spacing-card: ${spacing.lg};
  --spacing-element: ${spacing.md};

  /* 圆角 */
  --radius-sm: ${borderRadius.sm};
  --radius-md: ${borderRadius.md};
  --radius-lg: ${borderRadius.lg};
  --radius-xl: ${borderRadius.xl};
  --radius-2xl: ${borderRadius['2xl']};
}
`

export default {
  colors,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  cssVariables,
}

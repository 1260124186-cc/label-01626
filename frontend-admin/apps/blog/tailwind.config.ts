/**
 * 博客主站 Tailwind CSS 配置
 * 继承共享配置并添加博客特定配置
 */
import type { Config } from 'tailwindcss'
import sharedConfig from '@blog/shared/tailwind.config'

const config: Config = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  darkMode: false,
  theme: {
    extend: {
      ...sharedConfig.theme?.extend,
      // 博客特定配置
      typography: {
        DEFAULT: {
          css: {
            'maxWidth': '65ch',
            'color': 'inherit',
            'a': {
              'color': '#3b82f6',
              'textDecoration': 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config

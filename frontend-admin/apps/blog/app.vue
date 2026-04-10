<script setup lang="ts">
// 全局 SEO 配置
useSeoMeta({
  titleTemplate: '%s - TechBlog',
  ogSiteName: 'TechBlog',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>

<script setup lang="ts">
useSeoMeta({
  title: '关于我们',
  description: '了解 TechBlog 的故事和团队',
})

const stats = [
  { label: '文章数量', value: '200+', emoji: '📄', color: 'blue' },
  { label: '月活读者', value: '50K+', emoji: '👥', color: 'emerald' },
  { label: '订阅用户', value: '10K+', emoji: '📧', color: 'amber' },
  { label: '技术分类', value: '15+', emoji: '📁', color: 'rose' },
]

const team = [
  {
    name: '张三',
    role: '创始人 & 主编',
    avatar: '/img/person.webp',
    bio: '10年前端开发经验，Vue.js 核心贡献者',
  },
  {
    name: '李四',
    role: '技术编辑',
    avatar: '/img/person1.webp',
    bio: '全栈工程师，专注于 Node.js 和云原生技术',
  },
  {
    name: '王五',
    role: '内容运营',
    avatar: '/img/person2.webp',
    bio: '技术写作爱好者，擅长将复杂概念简单化',
  },
]

const features = [
  {
    emoji: '📝',
    title: '高质量内容',
    description: '每篇文章都经过严格审核，确保技术准确性和可读性',
    color: 'blue',
  },
  {
    emoji: '🎓',
    title: '系统化学习',
    description: '文章按照技术领域分类，帮助你系统性地学习新技术',
    color: 'emerald',
  },
  {
    emoji: '💬',
    title: '社区互动',
    description: '活跃的评论区和讨论，与其他开发者交流学习',
    color: 'amber',
  },
  {
    emoji: '🔔',
    title: '及时更新',
    description: '紧跟技术发展，第一时间分享最新技术动态',
    color: 'rose',
  },
]

function getColorClasses(color: string) {
  const colors: Record<string, { bg: string, icon: string, gradient: string }> = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
    },
    emerald: {
      bg: 'bg-emerald-100',
      icon: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-500',
    },
    amber: {
      bg: 'bg-amber-100',
      icon: 'text-amber-600',
      gradient: 'from-amber-500 to-orange-500',
    },
    rose: {
      bg: 'bg-rose-100',
      icon: 'text-rose-600',
      gradient: 'from-rose-500 to-pink-500',
    },
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero 区域 -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24 text-white lg:py-32"
    >
      <!-- 装饰背景 -->
      <div class="absolute inset-0 opacity-30">
        <div
          class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]"
        />
      </div>
      <div class="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
      <div class="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

      <div class="container relative z-10 mx-auto px-4 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <div
            class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <span>✨ 关于我们</span>
          </div>
          <h1
            class="mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-4xl font-bold text-transparent lg:text-6xl"
          >
            关于 TechBlog
          </h1>
          <p class="text-xl leading-relaxed text-blue-100/80">
            我们致力于为开发者提供高质量的技术内容，帮助每一位开发者在技术道路上不断成长。
          </p>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="relative z-20 -mt-12 border-b border-slate-200 bg-white py-12">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="rounded-2xl p-4 text-center transition-colors duration-300 hover:bg-slate-50"
            >
              <div
                class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                :class="getColorClasses(stat.color).bg"
              >
                {{ stat.emoji }}
              </div>
              <div class="mb-1 text-3xl font-bold text-slate-900 lg:text-4xl">
                {{ stat.value }}
              </div>
              <div class="font-medium text-slate-500">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 我们的故事 -->
    <section class="bg-slate-50 py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <div class="mb-12 text-center">
            <div
              class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm"
            >
              <span class="font-medium text-blue-600">Our Story</span>
            </div>
            <h2 class="text-3xl font-bold text-slate-900 lg:text-4xl">
              我们的故事
            </h2>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
            <div class="prose prose-lg max-w-none">
              <p class="mb-6 leading-relaxed text-slate-600">
                TechBlog 创立于 2020
                年，最初只是一个个人技术博客。随着内容的积累和读者的增加，我们逐渐发展成为一个技术内容平台。
              </p>
              <p class="mb-6 leading-relaxed text-slate-600">
                我们相信，优质的技术内容应该是免费且开放的。每一位开发者都应该有机会学习最新的技术知识，无论他们身处何地。
              </p>
              <p class="leading-relaxed text-slate-600">
                如今，TechBlog
                已经成为众多开发者学习和交流的平台。我们将继续坚持初心，为技术社区贡献更多有价值的内容。
              </p>
            </div>

            <!-- 时间线 -->
            <div class="mt-10 border-t border-slate-200 pt-10">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div class="flex items-start gap-4">
                  <div
                    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100"
                  >
                    <span class="font-bold text-blue-600">2020</span>
                  </div>
                  <div>
                    <h4 class="mb-1 font-semibold text-slate-900">
                      创立
                    </h4>
                    <p class="text-sm text-slate-500">
                      个人博客起步
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div
                    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100"
                  >
                    <span class="font-bold text-emerald-600">2023</span>
                  </div>
                  <div>
                    <h4 class="mb-1 font-semibold text-slate-900">
                      成长
                    </h4>
                    <p class="text-sm text-slate-500">
                      团队扩展
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div
                    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100"
                  >
                    <span class="font-bold text-amber-600">2026</span>
                  </div>
                  <div>
                    <h4 class="mb-1 font-semibold text-slate-900">
                      现在
                    </h4>
                    <p class="text-sm text-slate-500">
                      持续发展
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色功能 -->
    <section class="bg-white py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="mb-12 text-center">
          <div
            class="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm"
          >
            <span class="font-medium text-emerald-600">Why Us</span>
          </div>
          <h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
            为什么选择我们
          </h2>
          <p class="mx-auto max-w-2xl text-slate-500">
            我们提供全方位的技术学习体验，帮助你更高效地提升技能
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:border-slate-300 hover:bg-blue-50 hover:shadow-lg"
          >
            <div
              class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl text-white shadow-lg"
              :class="getColorClasses(feature.color).gradient"
            >
              {{ feature.emoji }}
            </div>
            <h3 class="mb-2 text-lg font-bold text-slate-900">
              {{ feature.title }}
            </h3>
            <p class="text-sm leading-relaxed text-slate-600">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 团队介绍 -->
    <section class="bg-slate-50 py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="mb-12 text-center">
          <div
            class="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm"
          >
            <span class="font-medium text-rose-600">Our Team</span>
          </div>
          <h2 class="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
            核心团队
          </h2>
          <p class="mx-auto max-w-2xl text-slate-500">
            一群热爱技术、热爱分享的开发者
          </p>
        </div>

        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <div
            v-for="member in team"
            :key="member.name"
            class="group rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-xl"
          >
            <div class="relative mb-6 inline-block">
              <img
                :src="member.avatar"
                :alt="member.name"
                class="h-28 w-28 rounded-2xl object-cover shadow-lg"
              >
              <div
                class="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm shadow-lg"
              >
                ✅
              </div>
            </div>
            <h3 class="mb-1 text-xl font-bold text-slate-900">
              {{ member.name }}
            </h3>
            <p class="mb-4 text-sm font-medium text-blue-600">
              {{ member.role }}
            </p>
            <p class="mb-6 text-sm text-slate-600">
              {{ member.bio }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

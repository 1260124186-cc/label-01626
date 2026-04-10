import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'posts',
          name: 'posts',
          component: () => import('@/views/PostsView.vue'),
        },
        {
          path: 'posts/create',
          name: 'post-create',
          component: () => import('@/views/PostEditView.vue'),
        },
        {
          path: 'posts/:id/edit',
          name: 'post-edit',
          component: () => import('@/views/PostEditView.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/CategoriesView.vue'),
        },
        {
          path: 'tags',
          name: 'tags',
          component: () => import('@/views/TagsView.vue'),
        },
      ],
    },
  ],
})

// 路由守卫 - 登录验证
router.beforeEach((to, _from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.meta.requiresAuth !== false && !isLoggedIn) {
    // 需要登录但未登录，跳转到登录页
    next({ name: 'login' })
  }
  else if (to.name === 'login' && isLoggedIn) {
    // 已登录但访问登录页，跳转到首页
    next({ name: 'dashboard' })
  }
  else {
    next()
  }
})

export default router

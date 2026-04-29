import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/cities'
  },
  {
    path: '/cities',
    name: 'Cities',
    component: () => import('@/views/Cities.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/policies',
    name: 'Policies',
    component: () => import('@/views/Policies.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/application-flows',
    name: 'ApplicationFlows',
    component: () => import('@/views/ApplicationFlows.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product-intros',
    name: 'ProductIntros',
    component: () => import('@/views/ProductIntros.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/hot-products',
    name: 'HotProducts',
    component: () => import('@/views/HotProducts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product-videos',
    name: 'ProductVideos',
    component: () => import('@/views/ProductVideos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/company-intros',
    name: 'CompanyIntros',
    component: () => import('@/views/CompanyIntros.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/site-locations',
    name: 'SiteLocations',
    component: () => import('@/views/SiteLocations.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin-users',
    name: 'AdminUsers',
    component: () => import('@/views/AdminUsers.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  const userStr = localStorage.getItem('admin_user')

  // 如果访问登录页
  if (to.path === '/login') {
    if (token) {
      next('/')
    } else {
      next()
    }
    return
  }

  // 需要认证的页面
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login')
      return
    }

    // 检查超级管理员权限
    if (to.meta.requiresSuperAdmin) {
      try {
        const user = JSON.parse(userStr)
        if (user.role !== 'super_admin') {
          next('/')
          return
        }
      } catch (error) {
        next('/login')
        return
      }
    }
  }

  next()
})

export default router

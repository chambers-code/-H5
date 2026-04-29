import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/policy'
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('@/views/Policy.vue'),
    meta: { title: '政策介绍' }
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/views/Product.vue'),
    meta: { title: '产品介绍' }
  },
  {
    path: '/company',
    name: 'Company',
    component: () => import('@/views/Company.vue'),
    meta: { title: '公司介绍' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '康力元'
  next()
})

export default router

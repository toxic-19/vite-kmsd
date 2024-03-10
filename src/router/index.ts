import { createRouter, createWebHistory, Router, RouteRecordRaw, RouterOptions } from 'vue-router'

const routes = <RouteRecordRaw[]>[
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'HOME',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: '/knowledge',
        name: 'knowledge',
        component: () => import('@/views/knowBase/index.vue'),
      },
    ],
  },
]

const options = <RouterOptions>{
  history: createWebHistory(),
  routes,
}

// 创建路由器 router
const router: Router = createRouter(options)

export default router

export { routes }

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
        path: '/spark',
        name: 'Spark',
        component: () => import('@/views/spark/index.vue'),
      },
      {
        path: '/knowledge',
        name: 'knowledge',
        component: () => import('@/views/knowBase/index.vue'),
      },
      {
        path: '/tags',
        component: () => import('@/views/tags/index.vue'),
      },
      {
        path: '/project',
        component: () => import('@/views/project/index.vue'),
      },
      {
        path: '/task/:projectId',
        component: () => import('@/views/task/index.vue'),
      },
    ],
  },
  {
    path: '/docs/:knowId',
    component: () => import('@/views/docs/index.vue'),
    children: [
      {
        path: '/docs/:knowId/:articleId',
        component: () => import('@/views/editor/index.vue'),
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

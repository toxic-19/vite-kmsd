import { createApp } from 'vue'
import App from './App.vue'
import globalComponent from '@/components/index' // 注册全局组件
import 'virtual:svg-icons-register' // 注册 SVG 图标组件
import '@/styles/index.scss' // 导入公共样式
import router from '@/router/index.ts' // 导入路由器

const app = createApp(App)
app.use(globalComponent)
app.use(router) // 路由挂载
app.mount('#app')

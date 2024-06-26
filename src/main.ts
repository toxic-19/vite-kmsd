import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import App from './App.vue'
import globalComponent from '@/components/index' // 注册全局组件
import 'virtual:svg-icons-register' // 注册 SVG 图标组件
import '@/styles/index.scss' // 导入公共样式
import router from '@/router/index.ts' // 导入路由器
import useTable from '@/utils/VxeTableUtils.ts'
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist) // 使用持久化存储插件
app.use(globalComponent)
app.use(router) // 路由挂载
app.use(pinia) // 注册Pinia
app.use(useTable)
app.mount('#app')

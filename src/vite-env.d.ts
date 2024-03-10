// ts不认识.vue文件，所以需要做一个声明扩充
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

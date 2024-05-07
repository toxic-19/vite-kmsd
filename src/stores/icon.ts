import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCollapsedStore = defineStore('collapsed', () => {
  const opened = ref(true)
  const leftWidth = ref('280px')
  function collapseMenu() {
    opened.value = !opened.value
    leftWidth.value = opened.value ? '280px' : '0px'
  }

  return { leftWidth, collapseMenu } // 组合式写法必须返回state中的所有属性
})

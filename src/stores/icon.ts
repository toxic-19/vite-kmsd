import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCollapsedStore = defineStore('collapsed', () => {
  const opened = ref(true)
  const leftWidth = ref('320px')
  function collapseMenu() {
    opened.value = !opened.value
    leftWidth.value = opened.value ? '320px' : '0px'
    console.log(leftWidth.value)
  }

  return { leftWidth, collapseMenu } // 组合式写法必须返回state中的所有属性
})

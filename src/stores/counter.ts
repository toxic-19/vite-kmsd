import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 基本概念
// state
// actions
// getters

// 命名 - use开头 Store结尾  id要求是独一无二的命名
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment } // 组合式写法必须返回state中的所有属性
})

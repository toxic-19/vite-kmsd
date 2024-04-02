import { ref } from 'vue'
import { defineStore } from 'pinia'

// 设置在知识库页跳转到文档页时携带信息
export const useKnowledgeStore = defineStore(
  'knowledge',
  () => {
    const currentKnowName = ref<string>('')
    const currentKnowId = ref<number>(0)
    function setCurrent(id: number, name: string) {
      currentKnowId.value = id
      currentKnowName.value = name
    }

    return { currentKnowId, currentKnowName, setCurrent } // 组合式写法必须返回state中的所有属性
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }],
    },
  },
)

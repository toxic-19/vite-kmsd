import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useBreadcrumbsStore = defineStore(
  'breadcrumbs',
  () => {
    const currentPath = ref<string>('/home')
    const setPath = (path: string) => {
      currentPath.value = path
    }
    return { currentPath, setPath }
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }],
    },
  },
)

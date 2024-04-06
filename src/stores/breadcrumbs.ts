import { defineStore } from 'pinia'
import { ref } from 'vue'
import { OneProject } from '@/api/project/type.ts'
export const useBreadcrumbsStore = defineStore(
  'breadcrumbs',
  () => {
    const currentPath = ref<string>('/home')
    const currentProject = ref<OneProject>() // 跳转到任务页时显示的project详情
    const setPath = (path: string) => {
      currentPath.value = path
    }
    const setProject = (item: OneProject) => {
      currentProject.value = item
    }
    return { currentPath, setPath, currentProject, setProject }
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }],
    },
  },
)

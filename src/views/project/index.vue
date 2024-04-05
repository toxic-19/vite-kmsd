<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProjectItem from './components/projectItem.vue'
import { getProjectList } from '@/api/project'
import { OneProject } from '@/api/project/type.ts'
const projectList = ref<OneProject[]>()
const getAllProjectList = async () => {
  console.log('执行1111')
  const { data } = await getProjectList()
  projectList.value = data
}
onMounted(() => {
  getAllProjectList()
})
</script>

<template>
  <div class="project">
    <project-item v-for="project in projectList" :key="project.id" :project="project" @refresh="getAllProjectList"></project-item>
  </div>
</template>

<style scoped lang="scss">
.project {
  width: 76%;
  margin: 0 auto;
  padding-top: 40px;
  display: flex;
  flex-wrap: wrap;
  grid-gap: 20px;
}
</style>

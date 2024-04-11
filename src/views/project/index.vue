<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import ProjectItem from './components/projectItem.vue'
import { getProjectList } from '@/api/project'
import { OneProject } from '@/api/project/type.ts'
import { SearchOutlined, CloseOutlined, ApartmentOutlined } from '@ant-design/icons-vue'
import CreateProjectDialog from '@/views/project/components/createProjectDialog.vue'
const projectList = ref<OneProject[]>()
const inputProjectName = ref<string>('')
const getAllProjectList = async () => {
  const { data } = await getProjectList({ isHangUp: current.value[0], projectName: inputProjectName.value })
  projectList.value = data
}
onMounted(() => {
  getAllProjectList()
})

const current = ref<string[]>(['isIng'])
const items = ref([
  {
    key: 'isIng',
    label: '进行中',
    title: '进行中',
  },
  {
    key: 'hangUp',
    label: '已挂起',
    title: '已挂起',
  },
])
const search = () => {
  getAllProjectList()
}
const reset = () => {
  inputProjectName.value = ''
  current.value = ['isIng']
  search()
}
const createProjectRef = ref<InstanceType<typeof CreateProjectDialog>>()
const create = () => {
  createProjectRef.value?.showModal(true)
}
</script>

<template>
  <div class="search">
    <a-input v-model:value="inputProjectName" type="text" size="small" autofocus></a-input>
    <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @select="search" />
    <a-button type="text" :icon="h(SearchOutlined)" @click="search">Search</a-button>
    <a-button type="text" :icon="h(CloseOutlined)" @click="reset">Reset</a-button>
  </div>
  <a-button class="create-btn" type="primary" :icon="h(ApartmentOutlined)" @click="create">新建项目</a-button>
  <div class="project">
    <project-item v-for="project in projectList" :key="project.id" :project="project" @refresh="getAllProjectList"></project-item>
  </div>
  <div class="empty-status" v-if="!projectList?.length">
    <empty-status></empty-status>
  </div>
  <create-project-dialog ref="createProjectRef" @refresh="getAllProjectList"></create-project-dialog>
</template>

<style scoped lang="scss">
.project {
  width: 76%;
  margin: 0 auto;
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  grid-gap: 20px;
  position: relative;
}
.search {
  display: flex;
  width: 500px;
  height: 36px;
  margin: 6px 184px;
  .ant-input {
    width: 200px;
    height: 30px;
    margin-right: 6px;
  }
  .ant-menu {
    height: 30px;
    line-height: 30px;
  }
}
.empty-status {
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.create-btn {
  position: absolute;
  right: 12%;
  top: 10px;
}
</style>

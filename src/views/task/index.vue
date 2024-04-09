<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBreadcrumbsStore } from '@/stores/breadcrumbs.ts'
import { storeToRefs } from 'pinia'
import EditTable from './editTable.vue'
import TaskGantt from './taskGantt/index.vue'
import { onMounted, ref } from 'vue'
import { RowVO } from '@/api/project/type.ts'
import { getTaskListByName, postCreateOneTask, postTaskListByProjectId, postUpdateOneTask } from '@/api/project'
import { message } from 'ant-design-vue'
const store = useBreadcrumbsStore()
const router = useRouter()
const { currentProject } = storeToRefs(store)
const activeProcess = ref(currentProject.value?.process[0])
const tableData = ref<RowVO[]>([])
const changeProcess = (name: string) => {
  activeProcess.value = name
  getTaskList(name, currentProject.value.id)
}
const getTaskList = async (processName: string, projectId: number) => {
  const { data } = await getTaskListByName({ processName, projectId })
  tableData.value = data
}
const createOneTask = async (row) => {
  const { id, days, dateEnd, dateStart, taskName, taskStatus } = row
  // 判断是修改还是创建
  const API = id ? postUpdateOneTask : postCreateOneTask
  const data = id
    ? { id, days, dateEnd, dateStart, taskName, taskStatus }
    : { ...row, projectId: currentProject.value.id, processName: activeProcess.value }
  const { code } = await API(data)
  if (code === 200) {
    message.success(`${id ? '修改' : '创建'}成功`)
  }
  getTaskList(activeProcess.value, currentProject.value.id)
}
const showGantt = ref<boolean>(false)
onMounted(() => {
  getTaskList(activeProcess.value, currentProject.value.id)
})
</script>

<template>
  <task-gantt v-if="showGantt" @close-gantt="showGantt = false"></task-gantt>
  <template v-if="!showGantt">
    <div class="header">
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240); width: 88%"
        :title="currentProject?.projectName"
        @back="router.back()"
      >
        <template #extra>
          <SvgIcon name="gantt" text="甘特图" @click="showGantt = true"></SvgIcon>
        </template>
      </a-page-header>
    </div>
    <div class="process">
      <div v-for="(item, index) in currentProject?.process" :key="index" class="process-item">
        <div v-if="Array.isArray(item)" class="level"></div>
        <template v-if="Array.isArray(item)">
          <div style="display: flex; flex-direction: column; background-color: #ebeff4">
            <div
              v-for="child in item"
              :key="child"
              class="text child"
              :class="{ 'active-process': activeProcess === child }"
              @click="changeProcess(child)"
            >
              <div class="circle"></div>
              <div class="process-name">{{ child }}</div>
            </div>
          </div>
        </template>
        <div v-else class="text" :class="{ 'active-process': activeProcess === item }" @click="changeProcess(item)">
          <div class="circle"></div>
          <div class="process-name">{{ item }}</div>
        </div>
        <div class="line"></div>
        <SvgIcon name="process"></SvgIcon>
      </div>
    </div>
    <div class="task-panel">
      <edit-table :table-data="tableData" @add-one="createOneTask"></edit-table>
    </div>
  </template>
</template>

<style scoped lang="scss">
.header {
  margin-left: 10%;
}
.process {
  width: 76%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  .process-item {
    display: flex;
    align-items: center;
    &:last-child {
      .svg-icon,
      .line {
        display: none;
      }
    }
  }
  .level {
    width: 60px;
    height: 56px;
    border: 3px solid #99beff;
    border-radius: 6px;
    margin-right: -20px;
  }
  .text {
    width: 120px;
    height: 34px;
    color: #000000;
    border: 1px solid #b9b9b9;
    border-radius: 4px;
    padding-left: 10px;
    background-color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.6s;
    box-shadow: 1px 1px 6px 0 rgba(0, 0, 0, 0.1);
    &.child {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .line {
    width: 46px;
    height: 5px;
    background-color: #cee8fa;
    border-radius: 2px;
    border: 1px solid #80abd5;
    margin-right: -6px;
    margin-left: 6px;
  }
  .circle {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #33c33f;
    border-radius: 50%;
    margin-right: 6px;
  }
  .process-name {
    height: 22px;
    font-size: 14px;
    font-weight: 300;
  }
  .active-process {
    background-color: #65c48f;
    color: #fff;
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.2);
    .circle {
      background-color: #495d81;
    }
  }
}
:deep(.ant-page-header) {
  padding: 10px 24px;
}
:deep(.ant-page-header-heading-title) {
  font-size: 16px;
  color: #222222;
}
:deep(.ant-page-header-heading-extra) {
  display: flex;
  cursor: pointer;
}
</style>

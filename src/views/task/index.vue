<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBreadcrumbsStore } from '@/stores/breadcrumbs.ts'
import { storeToRefs } from 'pinia'
import EditTable from './editTable.vue'
const store = useBreadcrumbsStore()
const router = useRouter()
const { currentProject } = storeToRefs(store)
console.log(currentProject)
</script>

<template>
  <div class="header">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" :title="currentProject?.projectName" @back="router.back()" />
  </div>
  <div class="process">
    <div v-for="(item, index) in currentProject?.process" :key="index" class="process-item">
      <div v-if="Array.isArray(item)" class="level"></div>
      <template v-if="Array.isArray(item)">
        <div style="display: flex; flex-direction: column; background-color: #ebeff4">
          <div v-for="child in item" :key="child" class="text child">
            <div class="circle"></div>
            <div class="process-name">{{ child }}</div>
          </div>
        </div>
      </template>
      <div v-else class="text">
        <div class="circle"></div>
        <div class="process-name">{{ item }}</div>
      </div>
      <div class="line"></div>
      <SvgIcon name="process"></SvgIcon>
    </div>
  </div>
  <div class="task-panel">
    <edit-table></edit-table>
  </div>
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
}
:deep(.ant-page-header) {
  padding: 10px 24px;
}
:deep(.ant-page-header-heading-title) {
  font-size: 16px;
  color: #222222;
}
</style>

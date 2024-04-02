<script setup>
import { useRouter } from 'vue-router'
import { useBreadcrumbsStore } from '@/stores/breadcrumbs'
const router = useRouter()
const store = useBreadcrumbsStore()
const menuList = [
  { id: 0, name: '主页', icon: 'home', path: '/home' },
  { id: 1, name: '知识库', icon: 'knowledgeBase', path: '/knowledge' },
  { id: 2, name: '文档', icon: 'tags', path: '/tags' },
]

const changeTab = (path) => {
  router.push(path)
  store.setPath(path)
}
</script>
<template>
  <div class="header">
    <a-tabs v-model:activeKey="store.currentPath" @change="changeTab">
      <a-tab-pane v-for="tab in menuList" :key="tab.path" :tab="tab.name"></a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss" scoped>
.header {
  z-index: 2;
  width: 100%;
  height: 50px;
  display: flex;
  box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
  justify-content: center;
  font-size: 16px;
}

:deep(.ant-tabs-tab) {
  padding: 15px 0 !important;
  margin: 0 32px;
}
:deep(.ant-tabs .ant-tabs-tab-btn) {
  font-size: 15px;
}
:deep(.ant-tabs .ant-tabs-tab + .ant-tabs-tab) {
  margin: 0 32px;
}
:deep(.ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #222222;
}
</style>

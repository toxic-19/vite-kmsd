<script setup>
import { useRouter } from 'vue-router'
import { useBreadcrumbsStore } from '@/stores/breadcrumbs'
const router = useRouter()
const store = useBreadcrumbsStore()
const menuList = [
  { id: 0, name: '主页', icon: 'home', path: '/home' },
  { id: 4, name: 'Chat', icon: 'spark', path: '/spark' },
  { id: 3, name: '项目', icon: 'project', path: '/project' },
  { id: 1, name: '知识库', icon: 'knowledgeBase', path: '/knowledge' },
  { id: 2, name: '文档', icon: 'addMd', path: '/tags' },
]

const changeTab = (path) => {
  router.push(path)
  store.setPath(path)
}
</script>
<template>
  <div class="header">
    <a-tabs v-model:activeKey="store.currentPath" @change="changeTab">
      <a-tab-pane v-for="tab in menuList" :key="tab.path">
        <template #tab>
          <span style="display: flex; font-size: 15px; align-items: center">
            <SvgIcon :name="tab.icon" style="margin-right: 8px"></SvgIcon>
            {{ tab.name }}
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <div class="info">
      <a-dropdown style="margin-left: 20px" placement="bottom" :arrow="{ pointAtCenter: true }">
        <div class="title">
          <span>toxic1910</span>
          <img class="avatar" src="@/assets/avatar.jpg" />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <div style="display: flex; justify-content: space-around">
                <SvgIcon name="person"></SvgIcon>
                个人中心
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
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
.info {
  position: absolute;
  right: 28px;
  top: 12px;
  .title {
    height: 30px;
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
      width: 26px;
      height: 26px;
      margin: 0 10px;
    }
    span {
      font-size: 16px;
    }
  }
}
:deep(.ant-tabs > .ant-tabs-nav) {
  margin-bottom: 0;
  height: 50px;
}
:deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap) {
  padding-top: 10px;
}
:deep(.ant-tabs-nav) {
  &::before {
    content: '';
    border-bottom: none;
  }
}
:deep(.ant-tabs-tab) {
  padding: 6px 0 !important;
  margin: 0 32px;
}
:deep(.ant-tabs .ant-tabs-tab + .ant-tabs-tab) {
  margin: 0 32px;
}
:deep(.ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #222222;
}
</style>

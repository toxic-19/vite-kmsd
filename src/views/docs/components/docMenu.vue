<script setup lang="ts">
import Tree from './tree.vue'
import { onMounted, reactive, ref } from 'vue'
import { treeData } from '../type'
import { getGroupList } from '@/api/knowBase'
import { useRoute } from 'vue-router'
const tree = ref<treeData>({})
const topArticles = reactive([
  {
    articleId: 1,
    title: '产品授权说明',
    description: '商业授权及价格',
  },
  {
    articleId: 2,
    title: '关于zyplayer-doc项目',
    description: '关于zyplayer-doc项目',
  },
])
const activeKey = ref(['1', '2', '3', '4'])
const articleName = ref<string>('')
const onSearch = (searchValue: string) => {
  console.log('use value', searchValue)
  console.log('or use this.value', articleName.value)
}
const route = useRoute()
const getTreeData = async () => {
  const { data } = await getGroupList(+route.params.knowId)
  tree.value = data
}
onMounted(() => {
  getTreeData()
})
</script>

<template>
  <div class="base-info">
    <div>个人知识库</div>
    <div class="settings">
      <a-tooltip title="知识库设置">
        <SvgIcon name="setting" width="24px" height="24px"></SvgIcon>
      </a-tooltip>
    </div>
  </div>
  <a-input v-model:value="articleName" placeholder="请输入" style="width: 230px; margin-left: 15px" @search="onSearch">
    <template #suffix>
      <SvgIcon name="search"></SvgIcon>
    </template>
  </a-input>
  <div class="doc-menu">
    <a-collapse v-model:activeKey="activeKey" ghost>
      <a-collapse-panel key="1" header="置顶文章" :show-arrow="false">
        <Tree v-bind="$attrs" :article-data="topArticles"></Tree>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="知识库目录" :show-arrow="false">
        <Tree v-bind="$attrs" :article-data="tree.article" :group-data="tree.group"></Tree>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<style scoped lang="scss">
.doc-menu {
  width: 240px;
  margin-left: 10px;
  margin-top: 20px;
  height: calc(100vh - 110px);
  overflow-y: scroll;
  border: 1px solid rgba(75, 99, 138, 0.1);
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar-track {
    border-radius: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.base-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 260px;
  height: 50px;
  font-weight: bold;
  padding: 15px;
  div {
    font-size: 15px;
  }
}
.menu-title {
  font-size: 12px;
  padding: 3px 5px;
  color: #888;
  cursor: pointer;
  line-height: 32px;
  height: 32px;
  box-sizing: border-box;
}
.settings {
  height: 40px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .svg-icon {
    cursor: pointer;
  }
}
:deep(.ant-collapse-ghost > .ant-collapse-content-box) {
  padding-block: 12px !important;
}
:deep(.ant-collapse .ant-collapse-content > .ant-collapse-content-box) {
  padding: 0 16px;
}
:deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-header-text) {
  font-size: 13px;
  padding: 3px 5px;
  color: #888;
  cursor: pointer;
}
</style>

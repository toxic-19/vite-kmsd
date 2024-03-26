<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGroupList } from '@/api/knowBase'
import { treeData } from '../type.ts'
import Tree from './tree.vue'
const tree = ref<treeData>({})
const activeKey = ref(['1'])
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
// 回到知识库首页
const router = useRouter()
const toKnowLedge = () => {
  router.push('/knowledge')
}
onMounted(() => {
  getTreeData()
})
</script>

<template>
  <div class="base-info">
    <div class="left-icon">
      <SvgIcon name="knowledgeBase" width="18px" height="18px" @click="toKnowLedge"></SvgIcon>
      <SvgIcon name="collapsed" width="12px" height="12px"></SvgIcon>
      <div class="knowledge-name">个人知识库</div>
    </div>
    <div class="settings">
      <a-tooltip title="知识库设置">
        <SvgIcon name="operate" width="18px" height="18px"></SvgIcon>
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
      <a-collapse-panel key="1" header="知识库目录" :show-arrow="false">
        <Tree :article-data="tree.article" :group-data="tree.group"></Tree>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<style scoped lang="scss">
.doc-menu {
  width: 240px;
  margin-left: 10px;
  margin-top: 20px;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  border: 1px solid rgba(75, 99, 138, 0.1);
  @include scrollBar();
}
.base-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 254px;
  height: 60px;
  font-weight: bold;
  padding: 15px 5px 15px 15px;
  .left-icon {
    display: flex;
    .svg-icon {
      margin-right: 2px;
    }
    [data-type='#icon-knowledgeBase'] {
      cursor: pointer;
    }
  }
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

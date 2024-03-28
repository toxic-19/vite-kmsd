<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGroupList } from '@/api/knowBase'
import { useKnowledgeStore } from '@/stores/knowledge'
import { storeToRefs } from 'pinia'
import { treeData } from './type.ts'
import Tree from './components/tree.vue'
import CreateDialog from './components/createDialog.vue'

const store = useKnowledgeStore()
const { currentKnowId, currentKnowName } = storeToRefs(store)
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

// 创建文档弹窗
const createArticleRef = ref(null)
const showModal = (groupId) => {
  createArticleRef.value.showModal(true, groupId)
}

const addInKnow = () => {
  console.log('点击', currentKnowId.value)
  createArticleRef.value.showModal(true)
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
      <div class="knowledge-name">{{ currentKnowName }}</div>
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
        <Tree :article-data="tree.article" :group-data="tree.group" @sendGrouId="showModal"></Tree>
        <template #extra>
          <a-dropdown placement="bottom">
            <a class="ant-dropdown-link" @click.prevent>
              <SvgIcon name="add" width="14px" height="14px" class="add-icon group-icon"></SvgIcon>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item @click.prevent="addInKnow()">
                  <div class="flex">
                    <SvgIcon name="md" width="13px" height="13px" color="red"></SvgIcon>
                    <span>文档</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-collapse-panel>
    </a-collapse>
  </div>

  <create-dialog ref="createArticleRef" @refreshMenu="getTreeData"></create-dialog>
</template>

<style scoped lang="scss">
.flex {
  display: flex;
  margin-bottom: 6px;
  &:last-child {
    margin-bottom: 0;
  }
  div {
    margin-right: 6px;
  }
}
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
:deep(.ant-collapse > .ant-collapse-item.ant-collapse-no-arrow > .ant-collapse-header) {
  display: flex;
  align-items: center;
}
</style>

<script setup lang="ts">
import {defineEmits, defineProps, inject, ref, watch} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { groupMenu, articleMenu } from '../type'
import { updateArticle } from '@/api/article'
const props = defineProps<{
  groupData?: groupMenu[]
  articleData?: articleMenu[]
}>()
const emit = defineEmits(['sendGrouId'])
const allData = ref<Array<groupMenu | articleMenu>>([])
const getTreeData = inject('refreshMenu')
const router = useRouter()
const route = useRoute()
const changeIcon = (item) => {
  item.iconName = item.iconName === 'collapsed' ? 'open' : 'collapsed'
}
const selectedId = ref<number>(0)
const getPreview = (articleId: number) => {
  const knowId = route.params.knowId
  selectedId.value = +articleId
  router.push({
    path: `/docs/${knowId}/${articleId}`,
  })
}
const addArticle = (groupId) => {
  // 传递groupId给docMenu组件
  emit('sendGrouId', groupId)
}
const reNameId = ref<number>(0)
const reNameTitle = ref<string>('')
const reName = (item) => {
  reNameId.value = item.articleId
  reNameTitle.value = item.title
}
const updateTitle = () => {
  console.log(reNameTitle.value)
  updateArticle(reNameId.value, {
    title: reNameTitle.value
  }).then(res => {
    reNameId.value = 0
    reNameTitle.value = ''
    getTreeData()
  })
}
watch(props, (newVal) => {
  let groupList = newVal.groupData || []
  let articleList = newVal.articleData || []
  groupList = groupList?.map((item) => {
    return { ...item, iconName: 'collapsed' }
  })
  allData.value = [...articleList, ...groupList]
  if (articleList.length) {
    getPreview(articleList[0]?.articleId)
  } else if (groupList.length) getPreview(groupList[0].childrenData[0].articleId)
})
</script>

<template>
  <div class="tree-item" v-for="item in allData" :key="item">
    <div class="doc-content" v-if="item.articleId">
      <div class="title" @click="getPreview(item.articleId)" :class="{ active: item.articleId === selectedId }">
        <SvgIcon name="markdown"></SvgIcon>
        <div class="name" v-if="reNameId !== item.articleId">{{ item.title }}</div>
        <a-input v-else v-model:value="reNameTitle" @pressEnter="updateTitle"></a-input>
        <div class="operate">
          <a-dropdown placement="bottom">
            <a class="ant-dropdown-link" @click.prevent>
              <SvgIcon name="operate" width="14px" height="14px" class="operate-icon group-icon"></SvgIcon>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item @click.prevent="reName(item)">
                  <div class="flex">
                    <SvgIcon name="edit" width="13px" height="13px"></SvgIcon>
                    <span>重命名</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div class="group-content" v-else>
      <div class="title">
        <SvgIcon :name="item.iconName" width="12px" height="12px" class="group-icon" @click="changeIcon(item)"></SvgIcon>
        <SvgIcon name="folder"></SvgIcon>
        <div class="name">{{ item.groupName }}</div>
        <div class="operate">
          <a-dropdown placement="bottom">
            <a class="ant-dropdown-link" @click.prevent>
              <SvgIcon name="add" width="14px" height="14px" class="add-icon group-icon"></SvgIcon>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item @click.prevent="addArticle(item.groupId)">
                  <div class="flex">
                    <SvgIcon name="md" width="13px" height="13px" color="red"></SvgIcon>
                    <span>文档</span>
                  </div>
                </a-menu-item>
                <a-menu-item @click.prevent="addArticle(item.groupId)">
                  <div class="flex">
                    <SvgIcon name="edit" width="13px" height="13px"></SvgIcon>
                    <span>重命名</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div :class="[item.iconName === 'collapsed' ? '' : 'hidden-doc', 'doc-content children-doc']">
        <template v-for="child in item.childrenData" :key="child.articleId">
          <a-tooltip :title="child.title" color="#bab3c3">
            <div class="title" @click="getPreview(child.articleId)" :class="{ active: child.articleId === selectedId }">
              <SvgIcon name="markdown"></SvgIcon>
              <div class="name">{{ child.title }}</div>
              <div class="operate">
                <SvgIcon name="operate" width="14px" height="14px" class="operate-icon group-icon"></SvgIcon>
              </div>
            </div>
          </a-tooltip>
        </template>
      </div>
    </div>
  </div>
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
.tree-item {
  cursor: pointer;
  div {
    font-size: 13px;
  }
}
.doc-content,
.group-content {
  .title {
    padding: 6px 10px;
    display: flex;
    align-items: center;
    border: 1px solid transparent;
    transition: all 0.1s;
    .name {
      width: 165px;
      padding-left: 4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 5px;
    }
    .operate {
      display: flex;
      width: 30px;
      opacity: 0;
    }
    &.active {
      background: rgb(12, 91, 138, 0.1);
      border-radius: 4px;
      border: 1px solid #bab3c3;
      .operate {
        opacity: 1;
      }
    }
    &:hover {
      //background: rgba(201, 201, 209, 0.2);
      background: rgba(248, 247, 247, 0.4);
      border-radius: 4px;
      border: 1px solid #bab3c3;
      .operate {
        opacity: 1;
      }
    }
  }
  .svg-icon {
    padding: 5px;
  }
}
.children-doc {
  .title {
    padding-left: 20px;
  }
  height: auto;
  overflow: hidden;
  transition: height 1s;
}
.hidden-doc {
  height: 0;
}
.group-icon {
  &:hover {
    background-color: #d4d4d9;
    border-radius: 3px;
  }
  &.operate-icon {
    padding: 6px;
  }
  &.add-icon {
    padding: 6px 7px;
  }
}
</style>

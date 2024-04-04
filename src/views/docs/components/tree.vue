<script setup lang="ts">
import { defineEmits, defineProps, inject, ref, watch } from 'vue'
import type { Directive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { groupMenu, articleMenu } from '../type'
import { deleteArticle, updateArticle } from '@/api/article'
import { postReNameGroup } from '@/api/knowBase'
import ArticleDropdown from '@/views/docs/components/articleDropdown.vue'
import GroupDropdown from '@/views/docs/components/groupDropdown.vue'
import { message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
const props = defineProps<{
  groupData?: groupMenu[]
  articleData?: articleMenu[]
}>()
const emit = defineEmits(['sendGrouId'])
const allData = ref<Array<groupMenu | articleMenu>>([])
const getTreeData = inject('refreshMenu') as Function
const router = useRouter()
const route = useRoute()
const changeIcon = (item: groupMenu) => {
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
// 新增文章
const addArticle = (groupId: number) => {
  // 传递groupId给docMenu组件
  emit('sendGrouId', groupId)
}

// 文章重命名
const reNameId = ref<number>(0)
const reNameTitle = ref<string>('')
const reName = (item: articleMenu) => {
  reNameId.value = item.articleId
  reNameTitle.value = item.title
}
const updateTitle = () => {
  updateArticle(reNameId.value, {
    title: reNameTitle.value,
  }).then(() => {
    message.success('重命名成功')
    reNameId.value = 0
    reNameTitle.value = ''
    getTreeData()
  })
}

// 分组重命名
const reGroupId = ref<number>(0)
const reGroupTitle = ref<string>('')
const reGroupName = (item: groupMenu) => {
  reGroupId.value = item.groupId
  reGroupTitle.value = item.groupName
}
const updateGroup = () => {
  postReNameGroup({
    groupId: reGroupId.value,
    groupName: reGroupTitle.value,
  }).then(() => {
    message.success('重命名成功')
    reGroupId.value = 0
    reGroupTitle.value = ''
    getTreeData()
  })
}

const deleteDoc = (article: articleMenu) => {
  const { articleId } = article
  Modal.confirm({
    title: 'Are you sure delete this article?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      return await deleteArticle({ articleId }).then(({ data }) => {
        if (data == articleId) {
          message.success('删除成功')
          getTreeData()
        }
      })
    },
    onCancel() {},
  })
}

// 1. 输入框聚焦指令
const vFocus: Directive = {
  // 在setup中 任何以 v 开头的驼峰式命名的变量都可以被用作一个自定义指令
  mounted: (el: HTMLElement) => {
    console.log('direction', el)
    el.focus() // mounted: 元素插入到父元素时调用
  },
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
  } else {
    const noArticle = groupList.every((item) => !item.childrenData.length)
    console.log('noArticle', noArticle)
    // TODO: 不一定要一进来就展示第一页；可以用来展示知识库设置。
  }
  // else if (groupList.length) getPreview(groupList[0].childrenData?.[0]?.articleId)
})
</script>

<template>
  <div class="tree-item" v-for="item in allData" :key="item">
    <div class="doc-content" v-if="item.articleId">
      <div class="title" @click="getPreview(item.articleId)" :class="{ active: item.articleId === selectedId }">
        <SvgIcon name="markdown"></SvgIcon>
        <div class="name" v-if="reNameId !== item.articleId">{{ item.title }}</div>
        <a-input v-else v-focus v-model:value="reNameTitle" @pressEnter="updateTitle"></a-input>
        <article-dropdown @reDocName="reName(item)" @delete="deleteDoc(item)"></article-dropdown>
      </div>
    </div>
    <div class="group-content" v-else>
      <div class="title">
        <SvgIcon :name="item.iconName" width="12px" height="12px" class="group-icon" @click="changeIcon(item)"></SvgIcon>
        <SvgIcon name="folder"></SvgIcon>
        <div class="name" v-if="reGroupId !== item.groupId">{{ item.groupName }}</div>
        <a-input v-else v-focus v-model:value="reGroupTitle" @pressEnter="updateGroup"></a-input>
        <group-dropdown @addDoc="addArticle(item.groupId)" @reGroupName="reGroupName(item)"></group-dropdown>
      </div>
      <div :class="[item.iconName === 'collapsed' ? '' : 'hidden-doc', 'doc-content children-doc']">
        <template v-for="child in item.childrenData" :key="child.articleId">
          <div class="title" @click="getPreview(child.articleId)" :class="{ active: child.articleId === selectedId }">
            <SvgIcon name="markdown"></SvgIcon>
            <div class="name" v-if="reNameId !== child.articleId">{{ child.title }}</div>
            <a-input v-else v-focus v-model:value="reNameTitle" @pressEnter="updateTitle"></a-input>
            <article-dropdown @reDocName="reName(child)" @delete="deleteDoc(child)"></article-dropdown>
          </div>
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

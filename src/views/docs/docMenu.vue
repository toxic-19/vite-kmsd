<script setup lang="ts">
import Tree from './tree.vue'
import { reactive } from 'vue'

const tree = reactive({
  article: [
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
  ],
  group: [
    {
      groupId: 1,
      groupName: 'Vue2',
      sortNum: 1,
    },
    {
      groupId: 2,
      groupName: '实习',
      sortNum: 2,
    },
  ],
})
</script>

<template>
  <div class="doc-menu">
    <Tree :article-data="tree.article" :group-data="tree.group">
      <template #tree="slotProps">
        {{ slotProps.content }}
      </template>
    </Tree>
  </div>
</template>

<style scoped lang="scss">
.doc-menu {
  width: 200px;
}
</style>

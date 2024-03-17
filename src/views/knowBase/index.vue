<script setup lang="ts">
import { getKnowledgeList } from '@/api/knowBase'
import { onMounted, ref } from 'vue'
import { KnowBase } from '@/api/knowBase/type'
import { ListItem } from '@/views/knowBase/type'
import BaseItem from './baseItem.vue'
import QuickCreate from './quickCreate.vue'

const allList = ref<ListItem[]>([])
const getBaseList = async () => {
  const { data } = await getKnowledgeList()
  const topKnowList = data.filter((item: KnowBase) => item.isTop)
  allList.value = [
    { title: '置顶知识库', list: topKnowList, isTop: true },
    { title: '全部知识库', list: data, isTop: false },
  ]
}

onMounted(() => {
  getBaseList()
})
</script>

<template>
  <div v-for="item in allList" :key="item.title">
    <div class="knowBase-title">{{ item.title }}</div>
    <div class="flex-container" v-if="item.list.length">
      <template v-for="base in item.list" :key="base.knowId">
        <base-item :base-info="base" @refresh="getBaseList"></base-item>
      </template>
      <quick-create :is-top="item.isTop" @refresh="getBaseList"></quick-create>
    </div>
  </div>
</template>

<style scoped lang="scss">
.knowBase-title {
  padding: 24px 0 0 24px;
  font-size: 16px;
}
.flex-container {
  display: flex;
  flex-wrap: wrap;
  padding: 24px;
}
</style>

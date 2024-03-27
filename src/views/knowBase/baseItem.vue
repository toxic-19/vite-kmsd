<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { postChangeTopStatus } from '@/api/knowBase'
import { useKnowledgeStore } from '@/stores/knowledge'
const emit = defineEmits(['refresh'])
const store = useKnowledgeStore()
defineProps({
  baseInfo: {
    type: Object,
    required: true,
    default: () => {},
  },
})
const router = useRouter()
const toDocs = (knowItem) => {
  const { id, kbName } = knowItem
  router.push({
    path: `/docs/${id}`,
  })
  store.setCurrent(id, kbName)
}
const beTop = async (id: number, isTop: boolean) => {
  console.log(id, isTop)
  postChangeTopStatus({ id, isTop: !isTop }).then(() => {
    // getBaseList()
    emit('refresh')
  })
}
</script>

<template>
  <div class="base-item" :style="{ backgroundImage: `url(${baseInfo.cover})` }">
    <div class="item-content">
      <div class="title">{{ baseInfo.kbName }}</div>
      <div class="desc">{{ baseInfo.kbDesc }}</div>
    </div>
    <div class="item-in" @click="toDocs(baseInfo)">
      <span>进入知识库</span>
      <SvgIcon name="arrow-right" width="13px" height="13px" />
    </div>
    <div class="top-btn" @click="beTop(baseInfo.id, baseInfo.isTop)">
      <a-tooltip :title="baseInfo.isTop ? '取消置顶' : '置顶'" overlayClassName="tooltip">
        <SvgIcon name="cancel-top" width="40px" height="40px" v-if="baseInfo.isTop" />
        <SvgIcon name="top" width="40px" height="40px" v-else />
      </a-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-item {
  width: 140px;
  height: 196px;
  margin-right: 24px;
  margin-bottom: 24px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease-out;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(31, 35, 41, 0.1);
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;
  &:hover {
    box-shadow: 4px 6px 6px rgba(31, 35, 41, 0.3);
    .item-in,
    .top-btn {
      opacity: 1;
    }
  }
}
.item-content {
  margin-top: 16px;
  .title {
    font-size: 15px;
    font-weight: bold;
    padding-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }
  .desc {
    font-size: 13px;
    word-break: break-word;
  }
}
.item-in {
  width: 100%;
  height: 36px;
  color: #f8faff;
  text-align: center;
  border-radius: 4px 8px 8px 4px;
  background: rgba(76, 99, 140, 0.45);
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  span {
    font-size: 13px;
    height: 20px;
  }
}
.top-btn {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip {
  font-size: 13px;
}
</style>

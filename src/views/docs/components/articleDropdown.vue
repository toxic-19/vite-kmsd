<script setup lang="ts">
import { defineEmits } from 'vue'
const emit = defineEmits(['reDocName', 'delete'])

const reName = () => {
  emit('reDocName')
}
const deleteArticle = () => {
  emit('delete')
}
</script>

<template>
  <div class="operate">
    <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
      <a class="ant-dropdown-link" @click.prevent>
        <SvgIcon name="operate" width="14px" height="14px" class="operate-icon group-icon"></SvgIcon>
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item @click.prevent="reName">
            <div class="flex">
              <SvgIcon name="edit" width="13px" height="13px"></SvgIcon>
              <span>重命名</span>
            </div>
          </a-menu-item>
          <a-menu-item @click.prevent="deleteArticle">
            <div class="flex">
              <SvgIcon name="delete" width="13px" height="13px"></SvgIcon>
              <span>删除</span>
            </div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
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
.operate {
  display: flex;
  width: 30px;
  opacity: 0;
}
</style>

<script setup lang="ts">
import { defineEmits } from 'vue'
const emit = defineEmits(['reGroupName', 'addDoc'])

const reName = () => {
  emit('reGroupName')
}
const addDoc = () => {
  emit('addDoc')
}
</script>

<template>
  <div class="operate">
    <a-dropdown placement="bottom">
      <a class="ant-dropdown-link" @click.prevent>
        <SvgIcon name="add" width="14px" height="14px" class="add-icon group-icon"></SvgIcon>
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item @click.prevent="addDoc">
            <div class="flex">
              <SvgIcon name="addMd" width="15px" height="15px" color="red"></SvgIcon>
              <span>文档</span>
            </div>
          </a-menu-item>
          <a-menu-item @click.prevent="reName">
            <div class="flex">
              <SvgIcon name="edit" width="13px" height="13px"></SvgIcon>
              <span>重命名</span>
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
  width: 28px;
  opacity: 0;
  padding-right: 6px;
}
</style>

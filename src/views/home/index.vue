<script setup lang="ts">
import { useAllSelect } from '@/hooks/useAllSelect.ts'
const { state, onCheckAllChange, plainOptions } = useAllSelect()
</script>

<template>
  <div>
    <a-checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="onCheckAllChange">
      Check all
    </a-checkbox>
    <a-divider />
    <a-checkbox-group v-model:value="state.checkedList" :options="plainOptions" />
  </div>
</template>

<style scoped lang="scss"></style>

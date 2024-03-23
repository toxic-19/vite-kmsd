<script setup lang="ts">
import DocMenu from './components/docMenu.vue'
import EditorIndex from '@/views/editor/index.vue'
import { useCollapsedStore } from '@/stores/icon'
import { storeToRefs } from 'pinia'
const store = useCollapsedStore()
const { leftWidth } = storeToRefs(store)
</script>

<template>
  <div class="docs">
    <div class="docs-left">
      <doc-menu></doc-menu>
    </div>
    <EditorIndex></EditorIndex>
  </div>
</template>

<style scoped lang="scss">
.docs {
  display: flex;
  justify-content: space-between;
  .docs-left {
    width: v-bind(leftWidth);
    transition: all 0.5s;
    overflow: hidden;
  }
}
</style>

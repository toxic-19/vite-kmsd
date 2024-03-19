<script setup lang="ts">
import DocMenu from './components/docMenu.vue'
import PreviewEditor from './components/previewEditor.vue'
</script>

<template>
  <div class="docs">
    <div class="docs-left">
      <doc-menu></doc-menu>
    </div>
    <div class="preview">
      <preview-editor></preview-editor>
    </div>
  </div>
</template>

<style scoped lang="scss">
.docs {
  display: flex;
  justify-content: space-between;
}
.preview {
  width: calc(100% - 300px);
  height: 100vh;
  overflow-y: scroll;
}
</style>

<script setup lang="ts">
import DocMenu from './components/docMenu.vue'
// import PreviewEditor from './components/previewEditor.vue'
import { ref } from 'vue'
const opened = ref(true)
const leftWidth = ref('320px')
const closeDocMenu = () => {
  opened.value = !opened.value
  leftWidth.value = opened.value ? '320px' : '0px'
}
const getContent = (id) => {
  console.log('index', id)
}
</script>

<template>
  <div class="docs">
    <div class="docs-left">
      <doc-menu :content="getContent" :name="true"></doc-menu>
    </div>
    <div class="preview" id="content">
      <header class="doc-header">
        <div class="doc-icon" @click="closeDocMenu">
          <SvgIcon name="menu-collapsed" width="20px" height="20px"></SvgIcon>
        </div>
        <div class="doc-info">
          <div class="info-title">Monica的UI参考</div>
          <div class="info-tags">
            <div class="tags-item">Vue2</div>
            <div class="tags-item">JS</div>
          </div>
        </div>
        <div class="doc-btn">
          <div class="self-edit-btn">
            <SvgIcon name="edit"></SvgIcon>
            <span>编辑</span>
          </div>
          <div class="self-edit-btn save-btn">
            <SvgIcon name="save"></SvgIcon>
            <span>保存</span>
          </div>
        </div>
      </header>
      <router-view></router-view>
      <!--      <preview-editor></preview-editor>-->
    </div>
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

.preview {
  width: 100%;
  height: 100vh;
  padding-left: 20px;
  overflow-y: scroll;
}
.doc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  z-index: 10;
  .doc-info {
    width: 90%;
    height: 100%;
    margin-bottom: 8px;
    .info-title {
      font-size: 16px;
      line-height: 28px;
      font-family: '华文新魏', serif;
    }
    .info-tags {
      display: flex;
      height: 18px;
      .tags-item {
        font-size: 12px;
        padding: 1px 5px;
        background: rgba(74, 98, 136, 0.2);
        margin-right: 5px;
        border-radius: 3px;
        color: #097553;
      }
    }
  }
  .doc-btn {
    width: 210px;
    display: flex;
    .self-edit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      padding: 5px 10px;
      border: 1px solid #4b638a;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 10px;
      span {
        font-size: 14px;
        padding-left: 10px;
        padding-right: 6px;
      }
      &:hover {
        background: #f8f6f6;
      }
    }
    .save-btn {
      color: #ffffff;
      background: #1758ee;
      &:hover {
        background: rgba(23, 88, 238, 0.8);
      }
    }
  }
  .doc-icon {
    .svg-icon {
      margin-right: 10px;
      padding: 10px;
      cursor: pointer;
    }
  }
}
</style>

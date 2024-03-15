<script setup lang="ts">
import { ref } from 'vue'
import { FormOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { postCreateKnowledge } from '@/api/knowBase'
import { message } from 'ant-design-vue'
const isShow = ref<boolean>(true)
const showForm = () => {
  isShow.value = false
}
const formData = ref({
  kbName: '',
  kbDesc: '',
})
const loadingForAdd = ref<boolean>(false)
const createBase = async () => {
  loadingForAdd.value = true
  const res = await postCreateKnowledge(formData.value)
  if (res.ok) {
    loadingForAdd.value = false
    isShow.value = true
    message.success(res.message)
  }
}
</script>

<template>
  <div class="empty-item">
    <div v-if="isShow">
      <div class="title">快速创建知识库</div>
      <div class="tips">实现内容沉淀</div>
      <div class="create-btn" @click="showForm">
        <SvgIcon name="create" width="40px" height="40px"></SvgIcon>
      </div>
    </div>
    <template v-else>
      <a-input v-model:value="formData.kbName" size="small">
        <template #suffix>
          <a-tooltip :title="formData.kbName || '知识库标题'">
            <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
          </a-tooltip>
        </template>
      </a-input>
      <a-textarea v-model:value="formData.kbDesc" placeholder="知识库描述" :auto-size="{ minRows: 2, maxRows: 3 }" />
      <a-button type="primary" :loading="loadingForAdd" @click="createBase">
        确认
        <template #icon>
          <FormOutlined />
        </template>
      </a-button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.empty-item {
  text-align: center;
  width: 140px;
  height: 196px;
  margin-right: 24px;
  margin-bottom: 24px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  box-shadow: 0 2px 4px rgba(31, 35, 41, 0.1);
  position: relative;
  &:hover {
    border-color: #87a2ff;
  }
  .title {
    font-size: 14px;
    margin: 16px 0 6px 0;
    font-weight: bold;
    color: #80abd5;
  }
  .create-btn {
    position: absolute;
    left: 50%;
    bottom: 10px;
    margin-left: -20px;
  }
}
.ant-input {
  font-size: 13px;
  padding: 4px 7px;
}
.ant-input-affix-wrapper-sm {
  margin: 10px 0;
  font-size: 14px;
}
.ant-btn-default,
.ant-btn-primary {
  margin-top: 40px;
  background-color: #4a6288;
}
.ant-btn-primary:not(:disabled):hover {
  background-color: #80abd5;
}
</style>

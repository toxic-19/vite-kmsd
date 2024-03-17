<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { FormOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { postCreateKnowledge } from '@/api/knowBase'
import { message } from 'ant-design-vue'

const emit = defineEmits(['refresh'])
const props = defineProps(['isTop'])
const isShow = ref<boolean>(true)
const showForm = () => {
  isShow.value = false
}
const formData = ref({
  kbName: '',
  kbDesc: '',
  isTop: false,
})
const loadingForAdd = ref<boolean>(false)
const createBase = () => {
  loadingForAdd.value = true
  formData.value.isTop = props.isTop
  postCreateKnowledge(formData.value)
    .then((res) => {
      if (res.code === 200) {
        loadingForAdd.value = false
        closeForm()
        message.success(res.message)
        emit('refresh')
      }
    })
    .catch(() => {
      loadingForAdd.value = false
      closeForm()
    })
}
const closeForm = () => {
  isShow.value = true
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
      <div class="close-icon" @click="closeForm">
        <CloseOutlined :style="{ fontSize: '14px', color: '#4a6288' }" />
      </div>
      <a-input v-model:value="formData.kbName" size="small">
        <template #suffix>
          <a-tooltip :title="formData.kbName || '知识库标题'">
            <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
          </a-tooltip>
        </template>
      </a-input>
      <a-textarea v-model:value="formData.kbDesc" placeholder="知识库描述" :auto-size="{ minRows: 3, maxRows: 3 }" />
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
  border: 1px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    repeating-linear-gradient(-45deg, #4b638a 0, #80abd5 0.8em, white 0, white 1em);
  box-shadow: 0 2px 4px rgba(31, 35, 41, 0.1);
  position: relative;

  &:hover {
    box-shadow: 0 0 6px 2px rgba(31, 35, 41, 0.3);
  }

  .close-icon {
    position: absolute;
    left: 5px;
    top: 5px;
  }

  .title {
    font-size: 14px;
    margin: 20px 0 6px 0;
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
  margin-top: 20px;
  background-color: #4a6288;
}
.ant-btn-primary:not(:disabled):hover {
  background-color: #80abd5;
}
</style>

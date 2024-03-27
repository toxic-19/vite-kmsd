<script setup lang="ts">
import { defineEmits, defineExpose, ref } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge'
import { postArticle } from '@/api/article'
import {storeToRefs} from "pinia";
const store = useKnowledgeStore()
const emit = defineEmits(['refreshMenu'])
// 弹窗数据
const open = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const currentGroupId = ref<number>()
const { currentKnowId } = storeToRefs(store)
const showModal = (flag: boolean, groupId: number) => {
  open.value = flag
  currentGroupId.value = groupId
}
const handleOk = () => {
  confirmLoading.value = true
  postArticle({
    knowId: currentKnowId,
    ...formState.value,
    groupId: currentGroupId.value,
  }).then((res) => {
    console.log(res)
    emit('refreshMenu')
    open.value = false
    confirmLoading.value = false
  })
}
// 表单数据
const formState = ref({
  title: '',
  description: '',
})
const labelCol = { style: { width: '150px' } }
const wrapperCol = { span: 14 }
defineExpose({
  showModal,
})
</script>

<template>
  <div class="create-dialog">
    <a-modal v-model:open="open" centered title="创建文章" :confirm-loading="confirmLoading" @ok="handleOk">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="文章标题">
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="文章描述">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="scss"></style>

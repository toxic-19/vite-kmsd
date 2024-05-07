<script setup>
import { useKnowledgeStore } from '@/stores/knowledge.ts'
import { onMounted, ref } from 'vue'
import { getKnowledgeInfo, postUpdateKnowInfo } from '@/api/knowBase/index.ts'
import { message } from 'ant-design-vue'
// import { Knowledge } from '@/views/knowBase/type.ts'

const { currentKnowId } = useKnowledgeStore()
const knowInfo = ref({})
const getKnowInfo = async () => {
  const { data } = await getKnowledgeInfo(currentKnowId)
  knowInfo.value = data
}
const submitUpdate = async () => {
  console.log(knowInfo.value)
  const res = await postUpdateKnowInfo({ ...knowInfo.value })
  if (res.code === 200 && res.data[0] === 1) {
    message.success('修改成功')
    getKnowInfo()
  }
}
onMounted(() => {
  getKnowInfo()
})
</script>

<template>
  <div class="setting-info">
    <a-form layout="vertical" :model="knowInfo">
      <a-form-item label="知识库名称">
        <a-input v-model:value="knowInfo.kbName" placeholder="请输入知识库名称" />
      </a-form-item>
      <a-form-item label="知识库描述">
        <a-input v-model:value="knowInfo.kbDesc" placeholder="请输入知识库描述" />
      </a-form-item>
      <a-form-item label="是否置顶">
        <a-switch v-model:checked="knowInfo.isTop" />
      </a-form-item>
      <a-form-item label="背景图链接" :wrapper-col="{ span: 28 }">
        <a-textarea v-model:value="knowInfo.cover" placeholder="请输入知识库背景图链接" :autoSize="{ minRows: 1, maxRows: 6 }" />
        <img class="cover-image" :src="knowInfo.cover" width="140px" height="250px" alt="" />
      </a-form-item>
      <a-form-item label="是否删除">
        <a-switch disabled v-model:checked="knowInfo.isDel" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submitUpdate">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.setting-info {
  width: 500px;
  padding-left: 40px;
  padding-top: 30px;
}
.cover-image {
  width: 80px;
  height: 100px;
  object-fit: cover;
  margin-top: 20px;
  border-radius: 6px;
}
</style>

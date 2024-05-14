<script setup>
import { useKnowledgeStore } from '@/stores/knowledge.ts'
import { onMounted, ref } from 'vue'
import { getKnowledgeInfo, postUpdateKnowInfo } from '@/api/knowBase/index.ts'
import * as qiniu from 'qiniu-js'
import { message } from 'ant-design-vue'
// import { Knowledge } from '@/views/knowBase/type.ts'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { uploadImages } from '@/api/qiniu/index.ts'
// import axiosInstance from '@/utils/request.ts'
const { currentKnowId } = useKnowledgeStore()
const knowInfo = ref({})
const getKnowInfo = async () => {
  const { data } = await getKnowledgeInfo(currentKnowId)
  knowInfo.value = data
}
const fileList = ref([])
const loading = ref(false)
const imageUrl = ref('')
const submitUpdate = async () => {
  const res = await postUpdateKnowInfo({ ...knowInfo.value })
  if (res.code === 200 && res.data[0] === 1) {
    message.success('修改成功')
    getKnowInfo()
  }
}
const handleChange = (info) => {
  const file = info.file.originFileObj
  if (info.file.status === 'uploading') {
    loading.value = true
    const options = {
      quality: 0.92,
      noCompressIfLarger: true,
    }
    // 压缩图片
    qiniu.compressImage(file, options).then((data) => {
      // {dist: Blob, width: 1080, height: 1080}
      const observable = uploadImages(data.dist)
      observable.subscribe({
        next: () => {},
        error: () => {},
        complete: (e) => {
          this.postsData = {
            ...this.postsData,
            cover: 'http://sddfn230x.hn-bkt.clouddn.com/' + e.key,
          }
        },
      })
    })
    // uploadFile(info.file).subscribe()
    // axiosInstance.post(
    //   'http://upload-z2.qiniup.com',
    //   {
    //     data: info.file,
    //   },
    //   {
    //     processData: false,
    //     contentType: false,
    //   },
    // )
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
        <a-textarea v-model:value="knowInfo.kbDesc" placeholder="请输入知识库描述" :autoSize="{ minRows: 1, maxRows: 10 }" />
      </a-form-item>
      <a-form-item label="是否置顶">
        <a-switch v-model:checked="knowInfo.isTop" />
      </a-form-item>
      <a-form-item label="背景图链接" :wrapper-col="{ span: 28 }">
        <a-textarea v-model:value="knowInfo.cover" placeholder="请输入知识库背景图链接" :autoSize="{ minRows: 1, maxRows: 6 }" />
        <img class="cover-image" :src="knowInfo.cover" width="140px" height="250px" alt="" />
      </a-form-item>
      <a-form-item label="是否删除">
        <a-switch v-model:checked="knowInfo.isDel" />
      </a-form-item>
      <a-form-item label="七牛云上传">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          accept="image/jpg, image/jpeg, image/png"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
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
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

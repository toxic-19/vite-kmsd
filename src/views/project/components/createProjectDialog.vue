<script setup lang="ts">
import { computed, defineEmits, defineExpose, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { selectOptions, TEMPLATE_MAP } from '@/utils/map.ts'
import { postCreateProject } from '@/api/project'
import { CreateProjectBody } from '@/api/project/type.ts'
import { message } from 'ant-design-vue'
const emit = defineEmits(['refresh'])
// 弹窗数据
const open = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

const showModal = (flag: boolean) => {
  open.value = flag
}
const createDocRef = ref()
// 表单数据
const formState = ref<CreateProjectBody>({
  projectName: '',
  processTemplate: 1,
  projectCover: '',
})
const processList = computed(() => {
  const result = TEMPLATE_MAP.get(formState.value.processTemplate)
  return result ? result.map((item) => item) : []
})
const processImage = computed(() => {
  const currentItem = selectOptions.value.find((option) => option.value === formState.value.processTemplate)
  return currentItem.back
})
const handleOk = () => {
  createDocRef.value.validate().then(async () => {
    confirmLoading.value = true
    formState.value.projectCover = processImage.value
    const { code } = await postCreateProject(formState.value)
    if (code === 200) message.success('创建项目成功')
    emit('refresh')
    showModal(false)
    confirmLoading.value = false
  })
}
const clearForm = () => {
  // 清空表单
  formState.value = {
    projectName: '',
    processTemplate: 1,
    projectCover: '',
  }
  createDocRef.value.resetFields()
  open.value = false
}

// 检验规则
const rules: Record<string, Rule[]> = {
  projectName: [
    { required: true, message: '请输入项目名称', trigger: 'change' },
    { min: 2, max: 10, trigger: 'blur' },
  ],
  processTemplate: [{ required: true, message: '请选择流程模板', trigger: 'blur' }],
}
const labelCol = { style: { width: '120px' } }
const wrapperCol = { span: 14, offset: 1 }
defineExpose({
  showModal,
})
</script>
<template>
  <div class="create-dialog">
    <a-modal
      v-model:open="open"
      centered
      keyboard
      title="创建项目"
      destroy-on-close
      :confirm-loading="confirmLoading"
      @cancel="clearForm"
      @ok="handleOk"
    >
      <a-form ref="createDocRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="项目名称" name="projectName">
          <a-input v-model:value="formState.projectName" placeholder="请输入项目名称" />
        </a-form-item>
        <a-form-item label="项目模板" name="processTemplate">
          <a-select ref="select" v-model:value="formState.processTemplate">
            <a-select-option v-for="item in selectOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目流程">
          <div class="process">
            <div v-for="item in processList" :key="item" class="process-item">
              <div class="text">{{ item }}</div>
              <SvgIcon name="process"></SvgIcon>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="项目背景" name="projectCover">
          <img class="project-cover" :src="processImage" alt="背景" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="scss" scoped>
.process {
  width: 341px;
  display: flex;
  flex-wrap: nowrap;
  font-size: 16px;
  .process-item {
    display: flex;
    .text {
      padding: 4px 15px;
      margin: 4px 0;
      border: 1px solid #bfd5ea;
      border-radius: 4px;
    }
    .svg-icon {
      margin: 0 5px;
    }
    &:last-child {
      .svg-icon {
        display: none;
      }
    }
  }
}
.project-cover {
  width: 120px;
}
</style>

<script setup lang="ts">
import { defineEmits, defineExpose, ref, defineComponent, onMounted } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge'
import { postArticle } from '@/api/article'
import { postCreateGroup } from '@/api/knowBase'
import { storeToRefs } from 'pinia'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { getTagList } from '@/api/tag'
const store = useKnowledgeStore()
const emit = defineEmits(['refreshMenu'])
// 弹窗数据
const open = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const currentGroupId = ref<number>()
const { currentKnowId } = storeToRefs(store)
const type = ref<number>(1) // type: group 2 or article 1
const showModal = (flag: boolean, groupId?: number, typeNum?: number) => {
  open.value = flag
  if (groupId) currentGroupId.value = groupId
  type.value = typeNum || 1
}
const createDocRef = ref()
// 表单数据
const formState = ref({
  title: '',
  description: '',
  tags: [],
  groupName: '',
})
const handleOk = () => {
  createDocRef.value.validate().then(() => {
    if (type.value === 2) {
      createGroup()
    } else createDoc()
  })
}
const clearForm = () => {
  // 清空表单
  formState.value = {
    title: '',
    description: '',
    tags: [],
    groupName: '',
  }
  createDocRef.value.resetFields()
}
// 标签选择框数据
const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes
  },
})

let index = 0
const items = ref()
const getTagsList = async () => {
  const { data } = await getTagList()
  items.value = data.map((item) => ({ value: item.tagName }))
}
const inputRef = ref()
const name = ref()
const addItem = (e: Event) => {
  e.preventDefault()
  items.value.push(name.value || `New item ${(index += 1)}`)
  name.value = ''
  setTimeout(() => {
    inputRef.value?.focus()
  }, 0)
}

// 检验规则
const rules: Record<string, Rule[]> = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'change' },
    { min: 2, max: 10, trigger: 'blur' },
  ],
  description: [{ min: 0, max: 20, message: '文章描述请不要超过20字', trigger: 'blur' }],
  tags: [{ type: 'array', max: 3, message: '文章标签请不要超过3个', trigger: 'blur' }],
  groupName: [
    { required: true, message: '请输入分组标题', trigger: 'change' },
    { min: 2, max: 10, trigger: 'blur' },
  ],
}
const labelCol = { style: { width: '120px' } }
const wrapperCol = { span: 14, offset: 1 }

// 新建文章
const createDoc = () => {
  confirmLoading.value = true
  const data = currentGroupId.value ? { groupId: currentGroupId.value } : { knowId: currentKnowId.value }
  postArticle({
    ...formState.value,
    ...data,
  }).then(() => {
    emit('refreshMenu')
    open.value = false
    confirmLoading.value = false
    clearForm()
  })
}

// 新建分组
const createGroup = () => {
  const data = { knowId: currentKnowId.value, groupName: formState.value.groupName }
  postCreateGroup(data).then(() => {
    emit('refreshMenu')
    open.value = false
    confirmLoading.value = false
    clearForm()
  })
}
onMounted(() => {
  getTagsList()
})
defineExpose({
  showModal,
})
</script>

<template>
  <div class="create-dialog">
    <a-modal
      v-model:open="open"
      centered
      title="创建文章"
      destroy-on-close
      :confirm-loading="confirmLoading"
      @cancel="clearForm"
      @ok="handleOk"
    >
      <a-form
        v-if="type === 1"
        ref="createDocRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="文章标题" name="title">
          <a-input v-model:value="formState.title" placeholder="请输入文章标题" />
        </a-form-item>
        <a-form-item label="文章描述" name="description">
          <a-textarea v-model:value="formState.description" placeholder="请输入文章描述" />
        </a-form-item>
        <a-form-item label="文章标签" name="tags">
          <a-select
            v-model:value="formState.tags"
            placeholder="请选择文章标签"
            mode="multiple"
            style="width: 275px"
            :listHeight="130"
            :options="items"
          >
            <template #dropdownRender="{ menuNode: menu }">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0" />
              <a-space style="padding: 4px 8px">
                <a-input ref="inputRef" v-model:value="name" placeholder="Please enter item" @pressEnter="addItem" />
                <a-button type="text" @click="addItem">
                  <template #icon>
                    <plus-outlined />
                  </template>
                  添加新标签
                </a-button>
              </a-space>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
      <a-form
        v-else
        ref="createDocRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="分组标题" name="groupName">
          <a-input v-model:value="formState.groupName" placeholder="请输入分组标题" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="scss"></style>

import { reactive, watch } from 'vue'

export const useAllSelect = () => {
  const plainOptions = ['Apple', 'Pear', 'Orange']
  const state = reactive({
    indeterminate: true,
    checkAll: false,
    checkedList: ['Apple', 'Orange'],
  })
  const onCheckAllChange = (e: any) => {
    Object.assign(state, {
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
    })
  }
  watch(
    () => state.checkedList,
    (val) => {
      state.indeterminate = !!val.length && val.length < plainOptions.length
      state.checkAll = val.length === plainOptions.length
    },
  )
  return {
    state,
    onCheckAllChange,
    plainOptions,
  }
}

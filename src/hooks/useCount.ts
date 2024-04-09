import { ref } from 'vue'

export const useCount = () => {
  const counter = ref(0)
  const increment = () => {
    counter.value++
  }
  const decrement = () => {
    counter.value--
  }
  return {
    counter,
    increment,
    decrement,
  }
}

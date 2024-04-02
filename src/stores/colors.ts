import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRandomColorStore = defineStore('randomColor', () => {
  const colorsList = ref<string[]>([])
  function getColors(tagLength: number) {
    colorsList.value = []
    const letters = 'ABCDEF'.split('')
    let color = ''
    const colorType = tagLength // 就是所需颜色个数
    for (let i = 0; i < colorType; i++) {
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * letters.length)]
      }
      const _color = color.slice(i * 6, i * 6 + 6)
      colorsList.value.push(`#${_color}`)
    }
  }
  return { getColors, colorsList }
})

<script setup lang="ts">
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { onMounted } from 'vue'
import markdownContent from '../markdown.md?raw'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => {
  const dom = document.getElementById('preview') as HTMLDivElement
  Vditor.preview(dom, markdownContent, {
    mode: 'dark',
    anchor: 1,
    markdown: {
      toc: true,
      listStyle: false,
    },
    after() {
      if (window.innerWidth <= 768) {
        return
      }
      getOutline()
      const firstSpan = document.getElementById('outline').querySelector('span')
      router.push(`/docs?knowId=1#${firstSpan.innerText}`)
    },
  })
})
const initOutline = () => {
  const headingElements = []
  const scrollDOM = document.getElementById('content')
  console.log(scrollDOM)
  Array.from(document.getElementById('preview').children).forEach((item) => {
    if (item.tagName.length === 2 && item.tagName !== 'HR' && item.tagName.indexOf('H') === 0) {
      headingElements.push(item)
    }
  })
  let toc = []
  scrollDOM.addEventListener('scroll', () => {
    const scrollTop = scrollDOM.scrollTop
    toc = []
    headingElements.forEach((item) => {
      toc.push({
        id: item.id,
        offsetTop: item.offsetTop,
      })
    })

    const currentElement = document.querySelector('.vditor-outline__item--current')
    for (let i = 0, iMax = toc.length; i < iMax; i++) {
      if (scrollTop < toc[i].offsetTop - 10) {
        if (currentElement) {
          currentElement.classList.remove('vditor-outline__item--current')
        }
        let index = i > 0 ? i : 0
        document.querySelector('span[data-target-id="' + toc[index].id + '"]').classList.add('vditor-outline__item--current')
        break
      }
    }
  })
}
const getOutline = () => {
  const outlineElement = document.getElementById('outline')
  Vditor.outlineRender(document.getElementById('preview'), outlineElement)
  if (outlineElement.innerText.trim() !== '') {
    outlineElement.style.display = 'block'
    initOutline()
    clickOutLine()
  }
}
const clickOutLine = () => {
  // const spans = document.getElementById('outline').querySelectorAll('span[data-target-id]') as object
  const ulDOM = document.getElementById('outline').querySelector('ul')
  console.log(ulDOM)
  ulDOM.addEventListener('click', (event: any) => {
    const title = event.target.innerText.replace(/\s/g, '-')
    window.location = '/docs?knowId=1#' + title
  })
}
</script>

<template>
  <div id="previewWrap">
    <div id="preview" class="preview"></div>
  </div>
  <div id="outline"></div>
</template>

<style scoped lang="scss">
#preview {
  width: 900px;
}

#previewWrap {
  padding: 0 0 20px 20px;
  margin-right: 260px;
}

#preview {
  margin: 0 auto;
  max-width: 768px;
}

#outline {
  display: none;
  position: fixed;
  width: 186px;
  top: 164px;
  right: 20px;
  bottom: 120px;
  overflow: auto;
  font-size: 12px;
  border-left: 1px solid var(--border-color);
  border-top: 1px solid var(--border-color);
  border-right: 0;
  --border-color: #eee;
  --toolbar-icon-hover-color: #4285f4;
  --textarea-text-color: #616161;
  --hover-background-color: #f6f8fa;
}

#outline.dark {
  --border-color: #d1d5da;
  --toolbar-icon-hover-color: #fff;
  --textarea-text-color: #a6aab0;
  --hover-background-color: #444d56;
}

.vditor-reset ul[data-style='*'] {
  list-style-type: disc;
}

.vditor-reset ul[data-style='*'] ul {
  list-style-type: circle;
}

.vditor-reset ul[data-style='*'] ul ul {
  list-style-type: square;
}

.vditor-reset ul[data-style='+'] {
  list-style-type: '\2764';
}

.vditor-reset ul[data-style='+'] ul {
  list-style-type: '\1f49a';
}

.vditor-reset ul[data-style='+'] ul ul {
  list-style-type: '\1f49b';
}

.vditor-reset ul[data-style='-'] {
  list-style-type: korean-hangul-formal;
}

.vditor-reset ul[data-style='-'] ul {
  list-style-type: decimal-leading-zero;
}

.vditor-reset ul[data-style='-'] ul ul {
  list-style-type: lower-alpha;
}

.vditor-reset ol[data-style='1)'] {
  list-style-type: simp-chinese-formal;
}

.vditor-reset ol[data-style='1)'] ol {
  list-style-type: simp-chinese-informal;
}

.vditor-reset ol[data-style='1)'] ol ol {
  list-style-type: trad-chinese-formal;
}

@media screen and (max-width: 768px) {
  #previewWrap {
    padding: 0 20px 20px 0;
  }

  #outline {
    display: none !important;
  }
}

:deep(.vditor-outline__item--current) {
  border-left: 1px solid #4285f4;
  color: #4285f4;
  background-color: #f6f8fa;
}
:deep(.vditor-outline__action) {
  width: 6px;
  height: 6px;
}
#outline li > span {
  cursor: pointer;
  display: block;
  border-left: 1px solid transparent;
  padding: 0 10px;

  &:hover {
    color: #4285f4;
  }
}
</style>

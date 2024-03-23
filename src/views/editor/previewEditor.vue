<script setup lang="ts">
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
const router = useRouter()
const route = useRoute()
const mdContent = ref('')
const initVditor = (mdContent) => {
  const dom = document.getElementById('preview') as HTMLDivElement
  const { knowId, articleId } = route.params
  Vditor.preview(dom, mdContent, {
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
      router.push(`/docs/${knowId}/${articleId}/#${firstSpan?.innerText}`)
    },
  })
}
const initOutline = () => {
  const headingElements = []
  const scrollDOM = document.getElementById('content')
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
    initOutline()
    clickOutLine()
  }
}
const clickOutLine = () => {
  // const spans = document.getElementById('outline').querySelectorAll('span[data-target-id]') as object
  const ulDOM = document.getElementById('outline').querySelector('ul')
  ulDOM.addEventListener('click', (event: any) => {
    const title = event.target.innerText.replace(/\s/g, '-')
    const { knowId, articleId } = route.params
    window.location = `/docs/${knowId}/${articleId}/#${title}`
  })
}
const showOutLine = () => {
  const outlineElement = document.getElementById('outline')
  const flag = outlineElement.style.display !== 'block'
  outlineElement.style.display = flag ? 'block' : 'none'
}
const getArticleContent = async (articleId: number) => {
  const { data } = await request(`/article/articleId/${articleId}`)
  mdContent.value = data?.content
  initVditor(mdContent.value)
}
watch(
  () => route.params.articleId,
  (newVal) => {
    getArticleContent(+newVal)
  },
  { immediate: true },
)
</script>

<template>
  <div id="previewWrap">
    <div id="preview" class="preview"></div>
  </div>
  <div id="outline"></div>
  <div class="float-menu" @click="showOutLine">
    <a-tooltip title="文章目录">
      <SvgIcon name="float-menu" width="30px" height="38px"></SvgIcon>
    </a-tooltip>
  </div>
</template>

<style scoped lang="scss">
#previewWrap {
  padding: 0 0 20px 20px;
  margin-right: 260px;
  #preview {
    margin: 0 auto;
    /*max-width: 768px;*/
  }
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
  border-right: 0;
  --border-color: #eee;
  --toolbar-icon-hover-color: #4285f4;
  --textarea-text-color: #616161;
  --hover-background-color: #f6f8fa;
  &.dark {
    --border-color: #d1d5da;
    --toolbar-icon-hover-color: #fff;
    --textarea-text-color: #a6aab0;
    --hover-background-color: #444d56;
  }
  li > span {
    cursor: pointer;
    display: block;
    border-left: 1px solid transparent;
    padding: 0 10px;

    &:hover {
      color: #4285f4;
    }
  }
}

.float-menu {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: fixed;
  right: 20px;
  top: 140px;
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: 1px 2px 6px 2px rgba(183, 183, 183, 0.8);
  transition: all 0.3s;
  &:hover {
    border: 1px solid #d9d6d6;
  }
}

@media screen and (max-width: 768px) {
  #previewWrap {
    padding: 0 20px 20px 0;
  }

  #outline {
    display: none !important;
  }
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

:deep(.vditor-outline__item--current) {
  border-left: 1px solid #4285f4;
  color: #4285f4;
  background-color: #f6f8fa;
}
:deep(.vditor-outline__action) {
  width: 6px;
  height: 6px;
}
</style>

<script setup lang="ts">
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { defineProps, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps(['preview'])
const router = useRouter()
const route = useRoute()
const mdContent = ref<string>('')
const path = ref<string>('')
const initVditor = () => {
  const dom = document.getElementById('preview') as HTMLDivElement
  Vditor.preview(dom, mdContent.value, {
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
      router.push(`${path.value}/#${firstSpan?.innerText}`)
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
  const ulDOM = document.getElementById('outline').querySelector('ul')
  ulDOM.addEventListener('click', (event: any) => {
    const title = event.target.innerText.replace(/\s/g, '-')
    const { knowId, articleId } = route.params
    window.location = `/docs/${knowId}/${articleId}/#${title}`
  })
}
const outlineWidth = ref<string>('50px')
const showOutLine = () => {
  const outlineElement = document.getElementById('outlineWrap')
  const flag = outlineElement.style.width == '0px'
  outlineElement.style.width = flag ? '240px' : '0px'
  outlineWidth.value = flag ? '260px' : '50px'
}
onMounted(() => {
  initVditor()
})
watch(
  () => props.preview,
  (newVal) => {
    mdContent.value = newVal
    initVditor()
  },
  { immediate: true },
)
watch(
  () => route.fullPath,
  (newVal) => {
    path.value = newVal.replace(/\/#[^/]+/g, '')
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div id="previewWrap">
    <div id="preview" class="preview"></div>
  </div>
  <div id="outlineWrap" style="width: 0">
    <div id="outline-title">目录</div>
    <div id="outline"></div>
  </div>
  <div class="float-menu" @click="showOutLine">
    <a-tooltip title="文章目录">
      <SvgIcon name="float-menu" width="30px" height="38px"></SvgIcon>
    </a-tooltip>
  </div>
</template>

<style scoped lang="scss">
@import './editor-reset.scss';
#previewWrap {
  padding: 0 0 20px 20px;
  margin-right: v-bind(outlineWidth);
  #preview {
    margin: 0 auto;
  }
}
#outlineWrap {
  //display: none;
  position: fixed;
  //width: 186px;
  top: 164px;
  right: 20px;
  bottom: 120px;
  overflow: auto;
  font-size: 12px;
  border-left: 1px solid var(--border-color);
  border-right: 0;
  overflow-x: hidden;
  --border-color: #eee;
  --toolbar-icon-hover-color: #4285f4;
  --textarea-text-color: #616161;
  --hover-background-color: #f6f8fa;
  @include scrollBar;
  &.dark {
    --border-color: #d1d5da;
    --toolbar-icon-hover-color: #fff;
    --textarea-text-color: #a6aab0;
    --hover-background-color: #444d56;
  }
  #outline-title {
    font-size: 18px;
    font-weight: bold;
    padding-left: 16px;
    margin-bottom: 16px;
  }
  #outline {
    display: block;
    width: 100%;
    border-right: none;
  }
  :deep(ul li span) {
    padding-left: 0 !important;
  }
  li > span {
    cursor: pointer;
    display: block;
    border-left: 1px solid transparent;

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
  z-index: 999;
  &:hover {
    border: 1px solid #d9d6d6;
  }
}

@media screen and (max-width: 768px) {
  #previewWrap {
    padding: 0 20px 20px 0;
  }

  #outlineWrap {
    display: none !important;
  }
}
</style>

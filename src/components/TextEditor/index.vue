<template>
  <div class="text-editor" ref="editor"></div>
</template>

<script>
import E from 'wangeditor'
import { upLoadCourseImage } from '@/services/course'
export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      // 标记编辑的信息是否已经加载
      isLoaded: false
    }
  },
  // 结构加载好后执行
  mounted () {
    // 富文本编辑器初始化
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 事件设置需要在编辑器创建之前
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      // 自己实现图片上传
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        var fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await upLoadCourseImage(fd)
        if (data.code === '000000') {
          // 上传图片，返回结果，将图片插入到编辑器中
          insertImgFn(data.data.name)
        }
      }
      // 创建编辑器
      editor.create()
      // editor 获取内容,复制给编辑器
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  watch: {
    // 通过监听器监听value的变化，仅监听初始的变化
    value () {
      if (this.isLoaded === false) {
        // 得到了加载的新数据，设置给富文本编辑器
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

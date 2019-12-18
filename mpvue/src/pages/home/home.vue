<template>
  <div>
    <div @click="dian">欢迎使用mpvue小程序框架</div>
    <!-- 示例组件用法button 详细用法请参考另一个文件夹mpvue-iview-weapp -->
    <i-button @click="handleClick" inline>行内按钮</i-button>
  </div>
</template>

<script>
  
  import {mapState} from 'vuex'//state辅助函数
  import {mapMutations} from 'vuex'//mutations辅助函数

export default {
  methods: {
    dian(){

    }
  },
  computed:{

  }

}
</script>
<style lang='less' scoped>
// 可以使用less样式预编译器进行嵌套

</style>

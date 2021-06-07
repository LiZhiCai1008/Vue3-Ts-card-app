<template>
  <div id="app">
    <layout />
  </div>
</template>

<script>
import layout from "@/layouts"
export default {
  components: {
    layout
  },
}
</script>
<style lang="scss">
#app {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, 微软雅黑, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 auto;
  overflow-x: hidden;
  font-size: 16px;
}
#nprogress {
  .bar {
    background: #F8B500 !important; //自定义颜色
  }
  .spinner-icon {
    border-top-color: #F8B500 !important;
    border-left-color: #F8B500 !important;
  }
}
</style>

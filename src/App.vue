<template>
  <div id="app">
    <layout />
  </div>
</template>

<script lang="ts">
import layout from "@/layouts/index.vue"
import { defineComponent, onMounted } from "vue";
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    layout
  },
  setup() {
    const store = useStore()
    onMounted(() => {
      const ORG_ID = localStorage.getItem("ORG_ID")
      const localCardInfoStr = localStorage.getItem("CARD_INFO") || "{}"
      const localCardListStr = localStorage.getItem("CARD_LIST") || "[]"
      const localMemberInfoStr = localStorage.getItem("MEMBER_INFO") || "{}"
      let localCardInfo = JSON.parse(localCardInfoStr)
      let localCardList = JSON.parse(localCardListStr) || []
      let localMemberInfo = JSON.parse(localMemberInfoStr)
      store.commit("app/SET_ORG_ID", ORG_ID || "")
      store.dispatch("entery/setMemberInfo", localMemberInfo || {})
      store.dispatch("card/setCardInfo", localCardInfo || {})
      store.commit("card/SET_CARD_LIST", localCardList || [])
    })
  }
})
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

<!-- 错误展示页面 -->
<template>
  <Page isHeader :isBack="false">
    <div class="lk-text-center lk-m-t-80">
      <van-image
        width="120"
        height="120"
        :src="require('@/assets/images/error.svg')"
      />
      <div class="lk-m-t-24 error-msg">{{ errorInfo.message }}</div>
    </div>
  </Page>
</template>

<script>
import { getQueryStringByUrl } from '@/utils/getQueryByUrl'
export default {
  name: "Error",
  components: {},
  data() {
    return {
      errorInfo: {
        message: ""
      }
    };
  },
  beforeRouteEnter (to, from, next) {
    // ...错误页面处理
    next(async vm => {
      // 处理参数
      vm.errorInfo = await getQueryStringByUrl()
      console.log("错误----------------", vm.errorInfo)
    })
  },
  computed: {},
  methods: {},
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.error-msg {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
}
</style>
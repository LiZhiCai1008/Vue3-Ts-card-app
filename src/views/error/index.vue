<!-- 错误展示页面 -->
<template>
  <Page isHeader :isBack="false">
    <div class="lk-text-center lk-m-t-80">
      <van-image
        width="120"
        height="120"
        :src="require('@/assets/images/error.svg')"
      />
      <div class="lk-m-t-24 error-msg">{{ message }}</div>
    </div>
  </Page>
</template>

<script lang="ts">
import { getQueryStringByUrl } from '@/utils/getQueryByUrl'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: "Error",
  async setup() {
    const message = ref("")
    const query = await getQueryStringByUrl()
    console.log(query)
    message.value = query.message
    console.log(message.value)
    return {
      message
    }
  }
})
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
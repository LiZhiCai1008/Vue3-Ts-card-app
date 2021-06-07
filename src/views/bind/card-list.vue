<template>
  <Page isHeader>
    <div class="content lk-text-center">
      <van-image
        width="120"
        height="120"
        :src="require('@/assets/images/ic_no_bind.svg')"
      />
      <p class="no-card-tips font-1 lk-m-t-16">暂未绑定储值卡</p>
      <van-button
        class="lk-m-t-60 font-1"
        color="#F8B500"
        block
        round
        @click="handleClickBind"
      >绑定储值卡</van-button>
    </div>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CardService } from "@/api/card"
import { HttpResponse } from "@/types/Response"
export default defineComponent({
  name: "CardList",
  setup() {
    const handleClickBind = async (): Promise<void> => {
      const { data }: HttpResponse = await CardService.getUserCardListApi({
        phone: "15297746924",
        orgId: "001125"
      })
      console.log(data.code);
    }
    return {
      handleClickBind
    }
  }
})
</script>

<style lang="scss" scoped>
  .no-card {
    margin-top: 120px;
    text-align: center;
    .no-card-tips {
      font-size: 18px;
      font-weight: 500;
      line-height: 18px;
    }
  }
  .card-box {
    width: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 210px;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;
    .card-info {
      margin: 12px 0;
      padding: 12px 0;
      .info {
        flex: 1;
        display: inline-block;
        margin-left: 12px;
        font-weight: 500;
        color: #fff;
      }
    }
    .card-status {
      top: 10px;
      right: 0;
      background-color: #F56C6C;
      color: #fff;
      font-size: 12px;
      border-radius: 10px 0 0 10px;
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
      text-align: center;
    }
    .card-num {
      left: 12px;
      bottom: 24px;
      color: #fff;
    }
  }
  .agreement-content {
    line-height: 24px;
  }
  .bind-other-card {
    width: 100%;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F8B500;
    line-height: 40px;
    text-align: center;
    box-sizing: border-box;
  }
</style>
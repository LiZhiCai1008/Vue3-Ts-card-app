<template>
  <Page isHeader>
    <div class="limit-form">
      <van-form @submit="handleClickSave" @failed="onFailed">
        <van-field
          v-model="singleDayLimit"
          :rules="[
            { validator: validatorPrice, message: '金额输入有误' }
          ]"
          name="单日金额限制"
          type="number"
          clearable
          label="单日金额限制"
          placeholder="选填,最大不超过1000"
          autocomplete="off"
          maxlength="7"
        />
        <van-field
          v-model="singleOrderLimit"
          :rules="[
            { validator: validatorPrice, message: '金额输入有误' }
          ]"
          name="单笔金额限制"
          type="number"
          clearable
          label="单笔金额限制"
          placeholder="选填,最大不超过1000"
          autocomplete="off"
          maxlength="7"
        />
        <van-field
          v-model="orderNumLimit"
          :rules="[
            { validator: validatorOrderNum, message: '请输入0-99内正整数' }
          ]"
          name="单日笔数限制"
          type="digit"
          clearable
          label="单日笔数限制"
          placeholder="选填,最大不超过100"
          autocomplete="off"
          maxlength="3"
        />
        <div class="content defalut-bg">
          <p class="lk-p-t-16 font-3 lk-font-14">数值为0或者为空，无限制</p>
          <van-button
            class="lk-m-t-40 font-1"
            color="#F8B500"
            block
            round
            @click="handleClickSave"
          >保存</van-button>
        </div>
      </van-form>
    </div>
  </Page>
</template>

<script lang="ts">
import { CardService } from '@/api/card'
import { amountFmt } from '@/utils/filter'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { defineComponent, computed, reactive, toRefs, onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
export default defineComponent({
  name: "BuyLimit",
  setup() {
    const router = useRouter()
    // 创建仓库
    const store = useStore()
    const limitForm = reactive({
      singleDayLimit: "",
      singleOrderLimit: "",
      orderNumLimit: ""
    })
    const cardInfo = computed(() => store.state.card.cardInfo)
    onBeforeMount(() => {
      limitForm.singleDayLimit = cardInfo.value.singleDayLimit ? amountFmt(Number(cardInfo.value.singleDayLimit)) : ""
      limitForm.singleOrderLimit = cardInfo.value.singleOrderLimit ? amountFmt(Number(cardInfo.value.singleOrderLimit)) : ""
      limitForm.orderNumLimit = cardInfo.value.orderNumLimit || ""
    })

    const validatorPrice = (value: string): boolean => {
      if (!value) return true
      let priceNum = Number(value)
      if (priceNum < 0 || priceNum >= 1000) {
        return false
      } else {
        return /^\d+(.\d{1,2})?$/.test(priceNum.toString())
      }
    }

    const validatorOrderNum = (value: string): boolean => {
      if (!value) return true
      let priceNum = Number(value)
      if (priceNum < 0 || priceNum >= 100) {
        return false
      } else return true
    }

    const handleClickSave = async (): Promise<any> =>{
      console.log('save', limitForm)
      try {
        let card = JSON.parse(localStorage.getItem("CARD_INFO") || "")
        const { data } = await CardService.updateLimitApi({
          cardNo: cardInfo.value.cardNo || card.cardNo,
          serialNo: cardInfo.value.serialNo || card.serialNo,
          ...limitForm
        })
        if (data.code === 200) {
          Toast("提交成功！")
          router.back()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const onFailed = (errorInfo: any) => {
      console.log('failed', errorInfo);
      Toast("信息有误，请检查")
    }
    return {
      ...toRefs(limitForm),
      validatorPrice,
      validatorOrderNum,
      handleClickSave,
      onFailed
    }
  }
})
</script>

<style lang="scss" scoped>
.limit-form {
  background-color: #ffffff;
}
</style>
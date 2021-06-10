<template>
  <Page isHeader>
    <div class="limit-form">
      <van-form ref="limitForm">
        <van-field
          v-model="limitForm.singleDayLimit"
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
          v-model="limitForm.singleOrderLimit"
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
          v-model="limitForm.orderNumLimit"
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
      </van-form>
    </div>
    <div class="content">
      <p class="lk-m-t-16 font-3 lk-font-14">数值为0或者为空，无限制</p>
      <van-button
        class="lk-m-t-40 font-1"
        color="#F8B500"
        block
        round
        @click="handleClickSave"
      >保存</van-button>
    </div>
  </Page>
</template>

<script>
import { updateLimitApi } from '@/api/card'
import { mapState } from 'vuex'
import { amountFmt } from '@/utils/filter'
export default {
  name: "BuyLimit",
  data() {
    return {
      updateLimitApi,
      limitForm: {
        singleDayLimit: "",
        singleOrderLimit: "",
        orderNumLimit: ""
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      vm.limitForm.singleDayLimit = vm.cardInfo.singleDayLimit ? amountFmt(vm.cardInfo.singleDayLimit) : ""
      vm.limitForm.singleOrderLimit = vm.cardInfo.singleOrderLimit ? amountFmt(vm.cardInfo.singleOrderLimit) : ""
      vm.limitForm.orderNumLimit = vm.cardInfo.orderNumLimit || ""
    })
  },
  computed: {
    ...mapState("card", ["cardInfo"])
  },
  methods: {
    validatorPrice(value) {
      if (!value) return true
      let priceNum = Number(value)
      if (priceNum < 0 || priceNum >= 1000) {
        return false
      } else {
        return /^\d+(.\d{1,2})?$/.test(priceNum)
      }
    },
    validatorOrderNum(value) {
      if (!value) return true
      let priceNum = Number(value)
      if (priceNum < 0 || priceNum >= 100) {
        return false
      } else return true
    },
    async handleClickSave() {
      console.log('save', this.limitForm)
      let that = this
      this.$refs.limitForm.validate().then(async() => {
        try {
          let card = JSON.parse(localStorage.getItem("CARD_INFO"))
          const { code } = await that.updateLimitApi({
            cardNo: that.cardInfo.cardNo || card.cardNo,
            serialNo: that.cardInfo.serialNo || card.serialNo,
            ...that.limitForm
          })
          if (code === 200) {
            that.$toast("提交成功！")
            that.$router.back()
          }
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
          that.$toast("信息有误，请检查")
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.limit-form {
  background-color: #ffffff;
}
</style>
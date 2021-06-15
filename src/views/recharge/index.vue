<template>
  <Page isHeader bg="#fff">
    <div v-show="!isRechargeSuccess">
      <div class="content card-wrap lk-p-t-12">
        <div
          :style="{
            backgroundImage: 'url(' + baseImg + (cardInfo.coverUrl || 'photo/h5C/card/card_default.png') + ')'
          }"
          class="card-box content lk-relative"
        >
          <div class="card-info lk-flex lk-m-t-12">
            <van-image
              round
              width="36"
              height="36"
              :src="baseImg + cardInfo.cardLogo || 'photo/h5C/card/card_logo.png'"
            />
            <span class="info lk-font-16 van-ellipsis">{{ cardInfo.cardName }}</span>
          </div>
        </div>
      </div>
      <div class="content recharge-wrap">
        <!-- 充值金额 -->
        <div class="recharge-box lk-p-t-14">
          <p class="lk-font-14 font-2 lk-m-b-24">选择充值金额</p>
          <!-- 套餐列表 -->
          <div
            class="amount-item content lk-flex"
            :class="{'active': box.checked}"
            v-for="(box, idx) in packageList"
            :key="idx"
            @click="handleChangeAmount(box)"
          >
            <div class="lk-flex-1 lk-flex">
              <span class="amount">{{ amountFmt(box.rechargeAmount) }} 元</span>
              <span v-if="box.sendAmount" class="amount-give">送{{ amountFmt(box.sendAmount) }}元</span>
            </div>
            <van-checkbox v-model="box.checked" checked-color="#F8B500" icon-size="18px" />
          </div>
          <!-- 其他金额 -->
          <div class="amount-item content lk-flex" @click="handleOtherAmount">
            <span v-if="!otherAmount" class="font-3">其他金额</span>
            <van-field
              class="other"
              ref="otherInput"
              v-else
              v-model="currentAmount"
              clearable
              maxlength="8"
              type="number"
              label=""
              placeholder="其他金额"
            />
          </div>
        </div>
        <!-- 充值协议 -->
        <div class="agreement lk-m-t-18">
          <van-checkbox v-model="agree" checked-color="#F8B500" icon-size="18px">
            同意<span class="agreement-tip" @click.stop="handleViewAgreement">《会员卡充值协议》</span>
          </van-checkbox>
        </div>
        <van-button
          color="#F8B500"
          class="lk-m-t-40 font-1"
          block
          round
          :loading="loading"
          loading-type="spinner"
          loading-text="正在充值..."
          @click="handleClickRecharge"
        >充值</van-button>
      </div>
    </div>
    <div v-show="isRechargeSuccess" class="lk-m-t-40 lk-font-16 font-1 lk-text-center">
      请等待跳转，如仍未到账，请联系客服处理。
    </div>
    <Popup
      :visible="isPopShow"
      title="会员卡充值协议"
    >
      <template v-slot:content>
        <p class="agreement-content">
          1、充值成功后，暂不支持线上退款，如需退款，请联系商户处理，如与商户存在冲突，可联系大黄鹅官方客服介入处理。<br>
          2、充值金额用于指定售货机购买消费，不能兑换现金使用，不计利息。<br>
          3、若您以非法、欺诈或利用本平台漏洞的方式使用储值卡，本平台有权随时终止您使用储值卡在本平台购买。 <br>
          4、账号余额不超过200元，超过200元不支持充值，单日充值次数不超过2次。
        </p>
      </template>
      <template v-slot:footer class="content">
        <van-button
          class="lk-m-t-16 font-1"
          color="#F8B500"
          block
          round
          @click="handleClickApply"
        >同意协议</van-button>
      </template>
    </Popup>
  </Page>
</template>

<script lang="ts">
import Popup from '@/components/Popups.vue'
import { Toast } from 'vant'
import { AppService } from '@/api/app'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { PackageItem, FormatType } from '@/types/Card.d'
import { amountFmt } from '@/utils/filter'
import { defineComponent, ref, computed, reactive, getCurrentInstance, toRefs, onActivated, nextTick, ComputedRef } from 'vue'
export default defineComponent({
  name: "Recharge",
  components: {
    Popup
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const app = getCurrentInstance()
    const baseImg = app && app.appContext.config.globalProperties.$baseImg
    const state = reactive<{
      packageList: PackageItem[],
      currentAmount: string,
      otherAmount: boolean,
      loading: boolean,
      agree: boolean,
      isViewFirst: boolean,
      isRechargeSuccess: boolean,
      amountFmt: FormatType
    }>({
      packageList: [],
      currentAmount: "0",
      otherAmount: false,
      loading: false,
      agree: false,
      isViewFirst: false,
      isRechargeSuccess: false,
      amountFmt
    })
    const otherInput = ref(null as HTMLInputElement | null)
    const isPopShow = computed(() => store.state.app.isPopShow)
    const cardInfo = computed(() => store.state.card.cardInfo)
    const memberInfo = computed(() => store.state.entery.memberInfo)
    const selectedPackage: ComputedRef = computed(() => state.packageList.find((item: PackageItem) => item.checked))


    onActivated(() => {
      getRechargePackage()
    })

    // 获取充值套餐
    const getRechargePackage = async ():Promise<void> => {
      try {
        const { data } = await AppService.getChargePackageApi({
          cardNo: cardInfo.value.cardNo,
          serialNo: cardInfo.value.serialNo
        })
        if (data.code === 200) {
          (data.content || []).forEach((item: PackageItem, idx: number) => {
            if (!idx) {
              item.checked = true
              state.currentAmount = (item.rechargeAmount / 100).toFixed(2)
            } else {
              item.checked = false
            }
          })
          state.packageList = data.content || []
        }
      } catch (error) {
        console.log(error)
      }
    }

    // 检查输入金额
    const checkAmount = (value: string): string => {
      const priceNum = Number(value)
      if (priceNum < 0 || priceNum > 200) {
        return "充值金额不能大于200"
      } else {
        const priceStr = priceNum.toString().split(".")[1] // 200.0000001
        if (priceStr && priceStr.length > 2) {
          return "金额限制为2位小数"
        } else {
          return ""
        }
      }
    }

    const handleChangeAmount = (item: PackageItem): void => {
      console.log(item)
      state.otherAmount = false
      state.currentAmount = (item.rechargeAmount / 100).toFixed(2)
      state.packageList.forEach((amount: PackageItem): void => {
        if (amount.rechargeItemSendId === item.rechargeItemSendId) {
          amount.checked = true
        } else {
          amount.checked = false
        }
      })
    }

    // 点击其他金额
    const handleOtherAmount = ():void => {
      state.currentAmount = ""
      state.otherAmount = true
      state.packageList.forEach((amount: PackageItem): void => {
        amount.checked = false
      })
      nextTick(() => {
        otherInput?.value?.focus()
      })
    }

    // 点击充值按钮 如果没有同意协议就弹出协议
    const handleClickRecharge = (): void => {
      if (!state.agree) {
        state.isViewFirst = false
        store.commit("app/SET_POP_SHOW", true)
        return
      }
      submitRecharge()
    }

    const handleViewAgreement = (): void => {
      state.isViewFirst = true
      store.commit("app/SET_POP_SHOW", true)
    }

    const handleClickApply = (): void => {
      store.commit("app/SET_POP_SHOW", true)
      state.agree = true
      !state.isViewFirst && submitRecharge()
    }

    const submitRecharge = async (): Promise<void> => {
      if (Number(state.currentAmount) <= 0) {
        Toast('充值金额需大于0')
        return
      }
      const errorMsg = checkAmount(state.currentAmount)
      console.log(errorMsg)
      if (errorMsg) {
        Toast(errorMsg)
        return
      }
      console.log("充值")
      try {
        state.loading = true
        const { data } = await AppService.wxPayApi({
          cardNo: cardInfo.value.cardNo,
          serialNo: cardInfo.value.serialNo,
          amount: Number(state.currentAmount),
          packAgeId: selectedPackage.value.rechargeItemSendId,
          phone: memberInfo.value.phone,
          openId: localStorage.getItem("OPEN_ID") || ""
        })
        if (data.code === 200) {
          console.log(data.content)
          if (data.content.isSuccess) {
            // 微信下单成功
            getWeixinPay(data.content.body)
          } else {
            Toast(data.content.message)
            state.loading = false
          }
        } else {
          state.loading = false
        }
      } catch (error) {
        console.log(error)
        state.loading = false
      }
    }

    // 调用微信收银台
    const getWeixinPay = async (body: string): Promise<void> => {
      let config = JSON.parse(body)
      window.WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: config.appId, //公众号名称，由商户传入
          timeStamp: `${config.timeStamp}`, //时间戳，自1970年以来的秒数
          nonceStr: config.nonceStr, //随机串
          package: config.package,
          signType: config.signType, //微信签名方式：
          paySign: config.paySign //微信签名
        },
        (res: any) => {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            // 支付成功后的回调函数
            state.loading = false
            state.isRechargeSuccess = true
            Toast("支付成功")
            const toast = Toast.loading({
              message: '充值中...',
              forbidClick: true,
              duration: 3000
            });
            setTimeout(() => {
              toast.clear()
              router.replace({
                name: "User"
              })
            }, 3000);
          } else {
            if (res.err_msg === "get_brand_wcpay_request:cancel") {
              // 取消支付
              Toast("用户取消支付")
              state.loading = false
            } else {
              // 支付错误
              Toast("支付错误")
              state.loading = false
            }
          }
        }
      );
    }
    return {
      ...toRefs(state),
      baseImg,
      isPopShow,
      cardInfo,
      memberInfo,
      otherInput,
      handleChangeAmount,
      handleOtherAmount,
      handleViewAgreement,
      handleClickApply,
      handleClickRecharge
    }
  }
})
</script>

<style lang="scss" scoped>
.card-wrap {
  background-color: #F5F7FA;
}
.card-box {
  width: 100%;
  background-size: 100% 175%;
  height: 120px;
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  overflow: hidden;
}
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
.recharge-wrap {
  border-radius: 12px 12px 0 0;
}
.recharge-box {
  background-color: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  .amount-item {
    height: 48px;
    box-sizing: border-box;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid;
    border-color: #E8EBED;
    background-color: inherit;
    &:last-child {
      margin-bottom: 0;
    }
    .amount {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    .amount-give {
      margin-left: 10px;
      font-size: 14px;
      color: #F8B500;
    }
    .other {
      padding: 0!important;
    }
  }
  .active {
    border-color: #F8B500;
    background-color: rgba(248, 181, 0, 0.1);
  }
}
.agreement {
  font-size: 14PX;
}
.agreement-tip {
  color: #F8B500;
}
.agreement-content {
  line-height: 24px;
}
</style>
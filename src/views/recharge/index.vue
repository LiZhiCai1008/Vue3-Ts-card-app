<template>
  <Page isHeader bg="#fff">
    <div v-show="!isRechargeSuccess">
      <div class="content card-wrap lk-p-t-12">
        <div
          :style="{
            backgroundImage: 'url(' + $baseImg + (cardInfo.coverUrl || 'photo/h5C/card/card_default.png') + ')'
          }"
          class="card-box content lk-relative"
        >
          <div class="card-info lk-flex lk-m-t-12">
            <van-image
              round
              width="36"
              height="36"
              :src="$baseImg + cardInfo.cardLogo || 'photo/h5C/card/card_logo.png'"
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
              <span class="amount">{{ box.rechargeAmount | amountFmt }} 元</span>
              <span v-if="box.sendAmount" class="amount-give">送{{ box.sendAmount | amountFmt }}元</span>
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
      <div slot="content">
        <p class="agreement-content">
          1、充值成功后，暂不支持线上退款，如需退款，请联系商户处理，如与商户存在冲突，可联系大黄鹅官方客服介入处理。<br>
          2、充值金额用于指定售货机购买消费，不能兑换现金使用，不计利息。<br>
          3、若您以非法、欺诈或利用本平台漏洞的方式使用储值卡，本平台有权随时终止您使用储值卡在本平台购买。 <br>
          4、账号余额不超过200元，超过200元不支持充值，单日充值次数不超过2次。
        </p>
      </div>
      <div slot="footer" class="content">
        <van-button
          class="lk-m-t-16 font-1"
          color="#F8B500"
          block
          round
          @click="handleClickApply"
        >同意协议</van-button>
      </div>
    </Popup>
  </Page>
</template>

<script>
import Popup from '@/components/Popups'
import { Toast } from 'vant'
import { getChargePackageApi, wxPayApi } from '@/api/app'
import { mapState, mapMutations } from 'vuex'
import { getWxJsConfigAction } from '@/utils/wx-config'
export default {
  name: "Recharge",
  components: {
    Popup
  },
  data() {
    return {
      packageList: [],
      currentAmount: 0,
      otherAmount: false,
      loading: false,
      agree: false,
      isViewFirst: false,
      isRechargeSuccess: false
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      vm.getRechargePackage()
    })
  },
  computed: {
    ...mapState('app', ['isPopShow']),
    ...mapState('card', ['cardInfo']),
    ...mapState('entery', ['memberInfo']),
    selectedPackage() {
      return this.packageList.find(item => item.checked) || {}
    }
  },
  methods: {
    ...mapMutations('app', ['SET_POP_SHOW']),
    // 获取充值套餐
    async getRechargePackage() {
      try {
        const { code, content } = await getChargePackageApi({
          cardNo: this.cardInfo.cardNo,
          serialNo: this.cardInfo.serialNo
        })
        if (code === 200) {
          (content || []).forEach((item, idx) => {
            if (!idx) {
              item.checked = true
              this.currentAmount = (item.rechargeAmount / 100).toFixed(2)
            } else {
              item.checked = false
            }
          })
          this.packageList = content || []
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 检查输入金额
    checkAmount(value) {
      let priceNum = Number(value)
      if (priceNum < 0 || priceNum > 200) {
        return "充值金额不能大于200"
      } else {
        let priceStr = priceNum.toString().split(".")[1] // 200.0000001
        if (priceStr && priceStr.length > 2) {
          return "金额限制为2位小数"
        } else {
          return false
        }
      }
    },
    handleChangeAmount(item) {
      console.log(item)
      this.otherAmount = false
      this.currentAmount = (item.rechargeAmount / 100).toFixed(2)
      this.packageList.forEach(amount => {
        if (amount.rechargeItemSendId === item.rechargeItemSendId) {
          amount.checked = true
        } else {
          amount.checked = false
        }
      })
    },
    // 点击其他金额
    handleOtherAmount() {
      this.currentAmount = ""
      this.otherAmount = true
      this.packageList.forEach(amount => {
        amount.checked = false
      })
      this.$nextTick(() => {
        this.$refs.otherInput.focus()
      })
    },
    // 点击充值按钮 如果没有同意协议就弹出协议
    handleClickRecharge() {
      if (!this.agree) {
        this.isViewFirst = false
        this.SET_POP_SHOW(true)
        return
      }
      this.submitRecharge()
    },
    handleViewAgreement() {
      this.isViewFirst = true
      this.SET_POP_SHOW(true)
    },
    async handleClickApply() {
      await this.SET_POP_SHOW(false)
      this.agree = true
      !this.isViewFirst && this.submitRecharge()
    },
    async submitRecharge() {
      if (this.currentAmount <= 0) {
        this.$toast('充值金额需大于0')
        return false
      }
      const errorMsg = this.checkAmount(this.currentAmount)
      console.log(errorMsg)
      if (errorMsg) {
        this.$toast(errorMsg)
        return false
      }
      console.log("充值")
      try {
        this.loading = true
        const { code, content } = await wxPayApi({
          cardNo: this.cardInfo.cardNo,
          serialNo: this.cardInfo.serialNo,
          amount: this.currentAmount,
          packAgeId: this.selectedPackage.rechargeItemSendId,
          phone: this.memberInfo.phone,
          openId: localStorage.getItem("OPEN_ID")
        })
        if (code === 200) {
          console.log(content)
          if (content.isSuccess) {
            // 微信下单成功
            let config = JSON.parse(content.body)
            this.getWeixinPay(config)
          } else {
            this.$toast(content.message)
            this.loading = false
          }
        } else {
          this.loading = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    // 调用微信收银台
    async getWeixinPay(config) {
      let that = this
      await getWxJsConfigAction()
      window.wx.chooseWXPay({
        timestamp: config.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: config.nonceStr, // 支付签名随机串，不长于 32 位
        package: config.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: config.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: config.paySign, // 支付签名
        success: function(res) {
          // 支付成功后的回调函数
          console.log("success---->", res, config)
          that.loading = false
          that.isRechargeSuccess = true
          that.$toast("支付成功")
          const toast = Toast.loading({
            message: '充值中...',
            forbidClick: true,
            duration: 3000
          });
          setTimeout(() => {
            toast.clear()
            that.$router.replace({
              name: "User"
            })
          }, 3000);
        },
        error: function(err) {
          console.log("error---->", err)
          that.$toast("支付错误")
          that.loading = false
        },
        // 支付取消回调函数
        cancel: function(res) {
          console.log("cancel---->", res)
          that.$toast("用户取消支付")
          that.loading = false
        },
        // 支付失败回调函数
        fail: function(res) {
          console.log("fail---->", res)
          that.$toast("支付失败")
          that.loading = false
        }
      })
    }
  }
}
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
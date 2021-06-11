<template>
  <Page isHeader>
    <div class="bind-form">
      <van-form label-width="2.2rem" ref="changeForm">
        <van-field
          v-model="changeForm.cardNo"
          :rules="[
            { required: true, message: '请输入实体卡卡号' }
          ]"
          name="卡号"
          type="number"
          label="卡号"
          placeholder="请输入实体卡卡号"
          autocomplete="off"
        >
          <template #right-icon>
            <i class="icon iconfont iconsaomiao lk-font-18" @click="handleScanCode" />
          </template>
        </van-field>
        <van-field
          v-model="changeForm.serialNo"
          :rules="[
            { required: true, message: '请输入序列号' }
          ]"
          name="序列号"
          autocomplete="off"
          clearable
          label="序列号"
          placeholder="请输入序列号"
        />
        <van-field label="绑定手机号">
          <template v-slot:input>
            <phone :phone="$route.query.phone || cardInfo.phone" />
          </template>
        </van-field>
        <van-field
          v-model="changeForm.oldPhoneCode"
          :rules="[
            { required: true, message: '请输入验证码' }
          ]"
          name="验证码"
          type="number"
          clearable
          label="验证码"
          maxlength="6"
          placeholder="请输入验证码"
          autocomplete="off"
        >
          <template #button>
            <MsgCode :phone="$route.query.phone || cardInfo.phone" type="RECHARGE_CARD_CHANGE_PHONE_OLD" />
          </template>
        </van-field>
        <van-field
          v-model="changeForm.newPhone"
          :rules="[
            { required: true, message: '请输入更换手机号' },
            { pattern: patternPhone, message: '手机号格式错误' }
          ]"
          name="更换手机号"
          type="number"
          clearable
          maxlength="11"
          label="更换手机号"
          placeholder="更换手机号"
          autocomplete="off"
        />
        <van-field
          v-model="changeForm.newPhoneCode"
          :rules="[
            { required: true, message: '请输入验证码' }
          ]"
          name="验证码"
          type="number"
          maxlength="6"
          clearable
          label="验证码"
          placeholder="请输入验证码"
          autocomplete="off"
        >
          <template #button>
            <MsgCode :phone="changeForm.newPhone" type="RECHARGE_CARD_CHANGE_PHONE_NEW" />
          </template>
        </van-field>
      </van-form>
    </div>
    <div class="content">
      <van-button
        class="lk-m-t-40 font-1"
        color="#F8B500"
        block
        round
        @click="handleClickChange"
      >更换</van-button>
    </div>
  </Page>
</template>

<script lang="ts">
import MsgCode from '@/components/Msgcode.vue'
import Phone from '@/components/Phone.vue'
import { updateCardPhoneApi } from '@/api/bind'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { defineComponent, computed, reactive } from 'vue'
import { getWxJsConfigAction } from '@/utils/wx-config'
import { useStore } from 'vuex'
export default defineComponent({
  name: "ChangePhone",
  components: {
    MsgCode,
    Phone
  },
  setup(props) {
    
  },
  data() {
    return {
      updateCardPhoneApi,
      patternPhone: /^1[3456789]\d{9}$/,
      changeForm: {
        cardNo: "",
        serialNo: "",
        oldPhoneCode: "",
        newPhone: "",
        newPhoneCode: ""
      },
      hasBindInfo: {}
    }
  },
  computed: {
    ...mapState("entery", ["memberInfo"]),
    ...mapState("card", ["cardInfo"])
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let { cardNo, serialNo } = to.query || {}
      vm.changeForm.cardNo = cardNo
      vm.changeForm.serialNo = serialNo
    })
  },
  methods: {
    // 点击扫描卡二维码
    async handleScanCode() {
      if (process.env.VUE_APP_ENV === "development") {
        this.parseResult("{host}/web/qrcode/recharge/card/1234567890123456/123123")
        return false
      }
      const TOAST = Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      await getWxJsConfigAction()
      window.wx.ready(() => {
        TOAST.clear()
        window.wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: res => {
            if (!res.resultStr) {
              this.$toast("二维码信息获取为空!")
              return false;
            }
            this.parseResult(res.resultStr)
          },
          fail: () => {
            this.$toast("二维码扫描失败!")
          }
        })
      })
      
    },
    // 解析扫码内容
    parseResult(str) {
      // {host}/web/qrcode/recharge/card/1234567890123456/123123
      // {host}/web/qrcode/recharge/card/{cardNo}/{serialNo}
      if (!str) return false
      let resultSplit = str.split("/"),
        length = resultSplit.length
      this.changeForm.cardNo = resultSplit[length - 2]
      this.changeForm.serialNo = resultSplit[length - 1]
    },
    async handleClickChange() {
      let that = this
      this.$refs.changeForm.validate().then(async() => {
        try {
          const { code, content } = await that.updateCardPhoneApi({
            ...that.changeForm,
            memberNo: that.memberInfo.memberNo
          })
          if (code === 200) {
            console.log(content)
            that.$toast("更改成功")
            this.$router.push({
              name: "User",
              query: {
                cardNo: this.changeForm.cardNo,
                serialNo: this.changeForm.serialNo
              }
            })
          }
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
          that.$toast("信息有误，请检查")
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.bind-form {
  background-color: #ffffff;
}
</style>
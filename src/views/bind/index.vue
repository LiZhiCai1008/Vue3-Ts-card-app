<template>
  <Page isHeader>
    <div class="bind-form">
      <van-form label-width="2rem" ref="bindForm">
        <van-field
          v-model="bindForm.cardNo"
          :rules="[
            { required: true, message: '请输入实体卡卡号' }
          ]"
          autocomplete="off"
          name="卡号"
          type="number"
          clearable
          label="卡号"
          placeholder="请输入实体卡卡号"
        >
          <template #right-icon>
            <i class="icon iconfont iconsaomiao lk-font-20" @click="handleScanCode" />
          </template>
        </van-field>
        <van-field
          v-model="bindForm.serialNo"
          :rules="[
            { required: true, message: '请输入序列号' }
          ]"
          name="序列号"
          autocomplete="off"
          type="text"
          clearable
          label="序列号"
          placeholder="请输入序列号"
        />
        <van-field
          v-model="bindForm.phone"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: patternPhone, message: '手机号格式错误' }
          ]"
          name="手机号"
          autocomplete="off"
          type="number"
          clearable
          label="手机号"
          maxlength="11"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="bindForm.vcode"
          :rules="[
            { required: true, message: '请输入验证码' }
          ]"
          name="验证码"
          autocomplete="off"
          type="number"
          clearable
          maxlength="6"
          label="验证码"
          placeholder="请输入验证码"
        >
          <template #button>
            <MsgCode :phone="bindForm.phone" type="RECHARGE_CARD_CHANGE_PHONE_NEW" />
          </template>
        </van-field>
        <!-- <van-field
          v-model="bindForm.orgName"
          name="单位/学校"
          type="text"
          clearable
          label="单位/学校"
          placeholder="请输入单位/学校"
        /> -->
        <van-field
          v-model="bindForm.userName"
          :rules="[
            { required: true, message: '请输入姓名' }
          ]"
          name="姓名"
          autocomplete="off"
          type="text"
          clearable
          label="姓名"
          maxlength="20"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="bindForm.remark"
          name="其他信息"
          autocomplete="off"
          autosize
          show-word-limit
          maxlength="50"
          type="textarea"
          label="其他信息"
          placeholder="请输入其他信息"
        />
      </van-form>
    </div>
    <div class="content">
      <p class="lk-m-t-12 font-3 lk-font-14">如无法扫描卡二维码，请联系管理员获取</p>
      <van-button
        class="lk-m-t-40 font-1"
        color="#F8B500"
        block
        round
        @click="handleClickSave"
      >绑定储值卡</van-button>
    </div>
  </Page>
</template>

<script>
import MsgCode from '@/components/Msgcode.vue'
import { getWxJsConfigAction } from '@/utils/wx-config'
import { cardBindApi } from "@/api/bind"
import { Toast } from 'vant'
import { mapState } from 'vuex'
export default {
  name: "Bind",
  components: {
    MsgCode
  },
  data() {
    return {
      cardBindApi,
      patternPhone: /^1[3456789]\d{9}$/,
      bindForm: {
        cardNo: "",
        serialNo: "",
        phone: "",
        vcode: "",
        userName: "",
        remark: ""
      }
    }
  },
  computed: {
    ...mapState("entery", ["memberInfo"])
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
      this.bindForm.cardNo = resultSplit[length - 2]
      this.bindForm.serialNo = resultSplit[length - 1]
    },
    async handleClickSave(values) {
      console.log('submit', values);
      let that = this
      this.$refs.bindForm.validate().then(async() => {
        try {
          const { code, content } = await that.cardBindApi({
            ...that.bindForm,
            memberNo: that.memberInfo.memberNo,
            orgId: localStorage.getItem("ORG_ID")
          })
          if (code === 200) {
            console.log(content)
            that.$toast("绑定成功")
            this.$router.push({
              name: "User",
              query: {
                cardNo: this.bindForm.cardNo,
                serialNo: this.bindForm.serialNo
              }
            })
          }
        } catch ({ code, message }) {
          // 报错已绑定
          console.log(code, message)
          if (code === 83001) {
            that.$toast("当前卡已被绑定，请更换手机号")
            this.$router.push({
              name: 'ChangePhone',
              query: {
                phone: message,
                cardNo: this.bindForm.cardNo,
                serialNo: this.bindForm.serialNo
              }
            })
          }
        }
      }).catch(() => {
          that.$toast("卡信息有误，请检查")
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bind-form {
  background-color: #ffffff;
}
</style>